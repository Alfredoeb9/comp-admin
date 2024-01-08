"use client";
import { useEffect, useState } from "react";
import {CheckboxGroup, Checkbox} from "@nextui-org/react";

export default function GameCategory() {
    const [game, setGame] = useState<string>("");
    const [selected, setSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | any>('');
    const [previousGameName, setPreviousGameName] = useState<string>("")


    useEffect(() => {
        if (error.includes("Please change the name")) {
            if (game !== previousGameName) {
                setError("")
            }
        }
    }, [error, game])
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
          if (game === '' || selected.length === 0) {
            setLoading(false);
            return setError('Please fill out the form');
          }

          if (error.length !== 0  && previousGameName === game) {
            setLoading(false);
            return setError("Error: Please change the name")
          }

          const newGame = {
            game: game,
            platforms: selected
          }

          const response = await fetch('/api/create/game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newGame)
          });

        //   console.log("response", response)

          const awaitedDate = await response.json();

          if (response.status === 500) {
            if (awaitedDate.message.includes("Sorry Game is already created")) {
                setPreviousGameName(newGame.game)
            }
            setError(awaitedDate.message)
          }
          setLoading(false);
          return response
    
        } catch (error) {
          console.log('game category error: ', error);
          return setError(error);
        }
    };

    return (
        <div className='darK:bg-slate-800 m-auto flex min-h-full w-96 flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
            <section className='w-full sm:max-w-md md:mt-0'>
                <h1 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight'>Game Category</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className='block text-sm font-medium leading-6'>Game:</label>
                        <input
                            className='mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
                            type="text"
                            onChange={(e) => setGame(e.target.value)}
                            value={game}
                        />
                    </div>

                    <CheckboxGroup
                        label="Select platforms:"
                        className='block text-sm font-medium leading-6 pt-2'
                        value={selected}
                        onValueChange={setSelected}
                    >
                        <Checkbox value="playstation">Playstation</Checkbox>
                        <Checkbox value="xbox">Xbox</Checkbox>
                        <Checkbox value="battle-net">Battle.net</Checkbox>
                        <Checkbox value="nintendo-switch">Nintendo Switch</Checkbox>
                    </CheckboxGroup>

                    <button
                        className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 mt-4 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-slate-500'
                        disabled={game.length === 0 || selected.length === 0 || loading || error.includes("Please change the name")}
                    >
                        Create Game Category
                    </button>
                    
                    {error && <div className="text-red-600 font-bold pt-2">{error}</div>}
                </form>

            </section>
            
        </div>
    )
}