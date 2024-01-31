'use client';
import { ReactElement, useEffect, useState } from 'react';
import { CheckboxGroup, Checkbox, Select, SelectItem } from '@nextui-org/react';
import { getCsrfToken } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import useSWR, { preload } from 'swr';
import { Rules } from '@/lib/rules';
import AddDynamicInputFields from '@/app/components/DynamicInputField';
import { Prisma } from '@prisma/client';

const fetcher = async (url: string | URL | Request ) => {
  const res = await fetch(url);

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.")

    // error.info = await await res.json()
    // error.status = res.status
    throw error
  }

  return res.json();
}

preload('/api/game-category', fetcher)

export default function CreateTournament() {
  const {data, isLoading, error} = useSWR('/api/game-category', fetcher)
  const cToken = getCsrfToken();
  const router = useRouter();
  const [title, setTitle] = useState<string>('');
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [clientError, setClientError] = useState<string | any>('');
  const [previousGameName, setPreviousGameName] = useState<string>('');
  const [games, setGames] = useState<any[]>([] || data);
  const [selectedGames, setSelectedGames] = useState<string>("");
  const [selectedTournamentType, setSelectedTournamentType] = useState<string | any>("");
  const [tournamentType, setTournamentType] = useState<string[]>(["community tournaments", "cash matches", "xp matches"]);
  const [startTime, setStartTime] = useState<string | number | readonly string[] | undefined>("2024-01-07T00:00");
  const [entry, setEntry] = useState<string>("");
  const [teamSize, setTeamSize] = useState<string>("");
  const [maxTeams, setMaxTeams] = useState<number | string>(0);
  const [enrolled, setEnrolled] = useState<number | string>(0);
  const [csrfToken, setCSRFToken] = useState<string | undefined>("");
  const [gameRules, setGameRules] = useState<any[]>([]);
  const [confirmedGameRules, setConfirmedGameRules] = useState<any>([]);

  useEffect(() => {
    if (data?.length > 0) {
      setGames(data);
    }
  }, [data])

  cToken.then((token) => {
    if (!token) throw new Error("Sorry please refresh")
    setCSRFToken(token)
  })

  useEffect(() => {
    if (clientError.includes('Please change the name')) {
      if (title !== previousGameName) {
        setClientError('');
      }
    }
  }, [clientError, title]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientError('');
    setLoading(true);
    try {
      if (title === '' || selected.length === 0) {
        setLoading(false);
        return setClientError('Please fill out the form');
      }

      if (clientError.length !== 0 && previousGameName === title) {
        setLoading(false);
        return setClientError('Error: Please change the name');
      }

      const newTournament = {
        gameCategoryId: arrById[0]?.id,
        game: title,
        name: arrById[0]?.game,
        platforms: selected,
        tournament_type: String(selectedTournamentType),
        entry: entry,
        team_size: teamSize,
        max_teams: Number(maxTeams),
        enrolled: Number(enrolled),
        start_time: startTime,
        rules: confirmedGameRules as Prisma.JsonArray
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
        setClientError(awaitedDate.message);
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
      return setClientError(error);
    }
  };

  function handleRuleChange(e: string, rule: string, index: number) {
    let setRule = {
      [rule]: e
    }
    const findExistingItem = confirmedGameRules.find((item: any) => {
      return Object.entries(item)[0][0] === rule
    })

    // if user changes value lets update correct array else create new array 
    if(findExistingItem) {
      confirmedGameRules.map((gameRule: any) => {
        setConfirmedGameRules((prevState: any[]) => {
          // Loop over your list
          return prevState.map((item) => {
              // Check for the item with the specified id and update it
              return item === findExistingItem ? {...item, [rule]: e} : item
          })
        })
      })
    } else {
      setConfirmedGameRules((confirmedGameRules: any) => [...confirmedGameRules, setRule])
    }
    // const activeData = document?.getElementById(String(index)) as HTMLInputElement;
    // console.log("active", activeData)
    // activeData.childNodes.forEach((child: any) => {
    //   if (child?.checked === true) {
        
    //   } else {
    //     setConfirmedGameRules(confirmedGameRules.filter((values: any) => values !== e.target.value))
    //   }
    // })
    
  }

  function filterByID(item: any) {
    if (selectedGames === item?.id) {
      return true;
    }
  }

  const arrById = games?.filter(filterByID)

  useEffect(() => {
    if (selectedGames.length > 0) {
      //@ts-ignore
      Rules.find((ele) => setGameRules(ele[arrById[0]?.game]))
    }
  }, [selectedGames, gameRules])

  return (
    <div className='darK:bg-slate-800 m-auto flex min-h-full w-96 flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
      <section className='w-full sm:max-w-md md:mt-0'>
        <h1 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight'>
          Create Tournament
        </h1>
        <form onSubmit={handleSubmit}>
          <input type='hidden' name='_csrf' value={csrfToken} />
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
              {data?.map((game: any) => (
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
            <Select 
              label="Tournament Type" 
              className="max-w-xs"
              // onChange={(e) => console.log("e", e)}
              // onSelectionChange={(e) => setSelectedTournamentType(e) }
              required
            >
              {tournamentType.map((type: any, i: number) => (
                <SelectItem onClick={(e) => setSelectedTournamentType((e?.target as HTMLElement).textContent)} key={i} value={type}>
                  {type}
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
              min={2}
              className='mt-2 block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6'
              type='number'
              onChange={(e) => setMaxTeams(e.target.value)}
              value={maxTeams}
            />
          </div>

          <div className='mb-2'>
            <label className='block text-sm font-medium leading-6'>Rules:</label>
            {Object.entries(gameRules).map((rule, key: number) => (
              <Select label={rule[0].charAt(0).toUpperCase() + rule[0].slice(1)} key={key} id={`${key}`} className='flex'>
                {/* <label className='text-sm leading-6'>{rule[0].charAt(0).toUpperCase() + rule[0].slice(1)}</label> */}
                  {rule[1].map((option: any, i: number) => (
                    <SelectItem value={option} key={i} onPress={(e) => handleRuleChange((e.target as HTMLElement).innerText, rule[0], i)}>
                      {option}
                    </SelectItem>
                  ))}
              </Select>
            ))}
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
              clientError.includes('Please change the name')
            }
          >
            Create Game Category
          </button>

          {clientError && <div className='pt-2 font-bold text-red-600'>{clientError}</div>}
        </form>
      </section>
    </div>
  );
}

// export async function getStaticProps() {
//   const queryClient = new QueryClient()

//   await queryClient.prefetchQuery({
//     queryKey: ['posts', 10],
//     queryFn: () => fetchPosts(10),
//   })

//   return {
//     props: {
//       dehydratedState: dehydrate(queryClient),
//     },
//   }
// }