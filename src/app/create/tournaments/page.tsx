'use client';
import { useEffect, useState } from 'react';
import { CheckboxGroup, Checkbox, Select, SelectItem } from '@nextui-org/react';

export default function CreateTournament() {
  const [title, setTitle] = useState<string>('');
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | any>('');
  const [previousGameName, setPreviousGameName] = useState<string>('');
  const [games, setGames] = useState<any>([]);
  const [selectedGames, setSelectedGames] = useState<string>("");

  const fetchData = async () => {
    try {
      const data = await fetch('/api/game-category');

      const response = await data.json();

      setGames(response);
    } catch (error) {
      console.log('error', error);
      setError(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (error.includes('Please change the name')) {
      if (title !== previousGameName) {
        setError('');
      }
    }
  }, [error, title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (title === '' || selected.length === 0) {
        setLoading(false);
        return setError('Please fill out the form');
      }

      if (error.length !== 0 && previousGameName === title) {
        setLoading(false);
        return setError('Error: Please change the name');
      }

      const newGame = {
        gameCategoryId: arrById[0]?.id,
        game: title,
        name: arrById[0]?.game,
        platforms: selected,
      };

      console.log("game", newGame)

      const response = await fetch('/api/create/tournament', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGame),
      });

      const awaitedDate = await response.json();

      if (response.status === 500) {
        if (awaitedDate.message.includes('Sorry Game is already created')) {
          setPreviousGameName(newGame.game);
        }
        setError(awaitedDate.message);
      }
      setLoading(false);
      return response;
    } catch (error) {
      console.log('game category error: ', error);
      return setError(error);
    }
  };

  function filterByID(item: any) {
    if (selectedGames === item?.id) {
      return true;
    }
  }

  const arrById = games?.filter(filterByID)

  console.log("arrById", arrById)

  return (
    <div className='darK:bg-slate-800 m-auto flex min-h-full w-96 flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
      <section className='w-full sm:max-w-md md:mt-0'>
        <h1 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight'>
          Create Tournament
        </h1>
        <form onSubmit={handleSubmit}>
          <div className='mb-2'>
            <label className='block text-sm font-medium leading-6'>Title:</label>
            <input
              className='mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              type='text'
              onChange={(e) => setTitle(e.target.value)}
              value={title}
            />
          </div>
          <div>
              <Select 
                label="Select a Game" 
                className="max-w-xs"
                onChange={(e) => console.log("e", e)}
                onSelectionChange={(e) => setSelectedGames(Object.values(e)[0]) }
              >
                {games.map((game: any) => (
                  <SelectItem key={game.id} value={game.game}>
                    {game.game}
                  </SelectItem>
                ))}
              </Select>
          </div>

          <CheckboxGroup
            label='Select platforms:'
            className='block pt-2 text-sm font-medium leading-6'
            value={selected}
            onValueChange={setSelected}
          >
            {arrById[0]?.platforms.map((platform: any, i: number) => (
              <Checkbox key={i} value={platform}>{platform}</Checkbox>
            ))}
          </CheckboxGroup>

          <button
            className='mt-4 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-slate-500'
            disabled={
              title.length === 0 ||
              selected.length === 0 ||
              loading ||
              error.includes('Please change the name')
            }
          >
            Create Game Category
          </button>

          {error && <div className='pt-2 font-bold text-red-600'>{error}</div>}
        </form>
      </section>
    </div>
  );
}
