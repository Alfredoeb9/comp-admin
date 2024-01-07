"use client";
import { useState } from "react";
import {CheckboxGroup, Checkbox} from "@nextui-org/react";

export default function GameCategory() {
    const [game, setGame] = useState<string>("");
    const [selected, setSelected] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | any>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
          if (game === '' || selected.length === 0) {
            return setError('Please provide a email and password');
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
          })
    
        } catch (error) {
          console.log('game category error: ', error);
          return setError(error);
        }
    };

    console.log("selected", selected)
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
                        disabled={game.length === 0 || selected.length === 0}
                    >
                        Create Game Category
                    </button>
                    
                </form>

            </section>
            
        </div>
    )
}