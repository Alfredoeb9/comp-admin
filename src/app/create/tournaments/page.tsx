'use client';
import { useEffect, useState } from 'react';
import { CheckboxGroup, Checkbox, Select, SelectItem } from '@nextui-org/react';
import { useRouter } from 'next/navigation';

export default function CreateTournament() {
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | any>('');
  const [previousGameName, setPreviousGameName] = useState<string>('');
  const [games, setGames] = useState<any>([]);
  const [selectedGames, setSelectedGames] = useState<string>("");
  const [selectedTournamentType, setSelectedTournamentType] = useState<string | any>("");
  const [tournamentType, setTournamentType] = useState<string[]>(["community tournaments", "cash matches", "xp matches"]);
  const [startTime, setStartTime] = useState<string | number | readonly string[] | undefined>("2024-01-07T00:00");
  const [entry, setEntry] = useState<string>("");
  const [teamSize, setTeamSize] = useState<string>("");
  const [maxTeams, setMaxTeams] = useState<number | string>(0);
  const [enrolled, setEnrolled] = useState<number | string>(0);

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
    
  }, [router, entry]);

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

      const newTournament = {
        gameCategoryId: arrById[0]?.id,
        game: title,
        name: arrById[0]?.game,
        platforms: selected,
        tournament_type: selectedTournamentType,
        entry: entry,
        team_size: teamSize,
        max_teams: Number(maxTeams),
        enrolled: Number(enrolled),
        start_time: startTime
      };

      const response = await fetch('/api/create/tournament', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTournament),
      });

      const awaitedDate = await response.json();

      if (response.status === 500) {
        if (awaitedDate.message.includes('Sorry Game is already created')) {
          setPreviousGameName(newTournament.game);
        }
        setError(awaitedDate.message);
      }
      setLoading(false);

      setGames([]);
      setTitle("");
      setSelectedGames("");
      setTournamentType(["community tournaments", "cash matches", "xp matches"]);
      setEntry("");
      setTeamSize("");
      setSelectedTournamentType("");
      setMaxTeams(0);
      setEnrolled(0);

      router.push("/create/tournaments")
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
              required
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
                required
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
            isRequired
          >
            {arrById[0]?.platforms.map((platform: any, i: number) => (
              <Checkbox key={i} value={platform}>{platform}</Checkbox>
            ))}
          </CheckboxGroup>

          <div className='mb-2'>
            <label className='block text-sm font-medium leading-6' htmlFor={"start-time"} >Start Time:</label>
            <input
              required
              className='mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              type="datetime-local"
              id="start-time"
              name="start-time"
              min="2024-01-07T00:00"
              onChange={(e) => setStartTime(e.target.value)}
              value={startTime}
            />
          </div>



          <div className='mb-2'>
            {/* <label className='block text-sm font-medium leading-6' htmlFor='tournament-type'>Tournament Type:</label>
            <input
              className='mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              type='text'
              name="tournament-type"
              maxLength={120}
              onChange={(e) => setTournamentType(e.target.value)}
              value={tournamentType}
            /> */}

              <Select 
                label="Tournament Type" 
                className="max-w-xs"
                onChange={(e) => console.log("e", e)}
                onSelectionChange={(e) => setSelectedTournamentType(e) }
                required
              >
                {tournamentType.map((game: any, i: number) => (
                  <SelectItem key={i} value={game}>
                    {game}
                  </SelectItem>
                ))}
              </Select>
          </div>

          <div className='mb-2'>
            <label className='block text-sm font-medium leading-6'>Entry:</label>
            <input
              required
              className='mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              type='text'
              onChange={(e) => setEntry(e.target.value)}
              value={entry}
            />
          </div>

          <div className='mb-2'>
            <label className='block text-sm font-medium leading-6'>Team Size:</label>
            <input
              required
              className='mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              type='text'
              onChange={(e) => setTeamSize(e.target.value)}
              value={teamSize}
            />
          </div>

          <div className='mb-2'>
            <label className='block text-sm font-medium leading-6'>Max Teams:</label>
            <input
              required
              className='mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              type='number'
              onChange={(e) => setMaxTeams(e.target.value)}
              value={maxTeams}
            />
          </div>

          <div className='mb-2'>
            <label className='block text-sm font-medium leading-6'>Enrolled:</label>
            <input
              required
              className='mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              type='number'
              onChange={(e) => setEnrolled(e.target.value)}
              value={enrolled}
            />
          </div>

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
