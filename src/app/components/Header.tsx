'use client';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  extendVariants,
} from '@nextui-org/react';
import { signOut, useSession } from 'next-auth/react';

export const MyDropDown = extendVariants(DropdownItem, {
  variants: {
    color: {
      default: {
        wrapper: ['data-[hover=true]:bg-red-400'],
      },
      stone: {
        wrapper: ['data-[hover=true]:bg-cyan-400'],
        selectedIcon: ['data-[hover=true]:bg-cyan-400'],
      },
    },
  },
});

export default function Header() {
  const { data: data, status } = useSession();

  return (
    <header>
      <Navbar>
        <NavbarBrand>
          <Link href='/' className='font-bold text-inherit'>
            MLG
          </Link>
        </NavbarBrand>
        <NavbarContent className='gap-4' justify='center'>
          {status === 'authenticated' &&
          data !== undefined &&
          data.user.role === 'admin' ? (
            <>
              <Dropdown
                showArrow
                classNames={{
                  base: 'before:bg-default-200', // change arrow background
                  content:
                    'border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black',
                }}
              >
                <NavbarItem>
                  <DropdownTrigger>
                    <Button>Create</Button>
                  </DropdownTrigger>
                </NavbarItem>
                <DropdownMenu
                  aria-label='create'
                  color='default'
                  variant='light'
                  className=''
                >
                  <DropdownItem
                    key='tournaments'
                    className='hover:bg-default-200'
                    aria-label='tournaments'
                  >
                    <Link href='/create/tournaments'>Tournaments</Link>
                  </DropdownItem>
                  <DropdownItem
                    className='hover:bg-default-200'
                    key='game_category'
                    aria-label='game_category'
                  >
                    <Link href='/create/game-category'>Game Category</Link>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <NavbarItem>
                <Button
                  as={Link}
                  color='primary'
                  onClick={() => {
                    signOut();
                  }}
                  variant='flat'
                >
                  Log Out
                </Button>
              </NavbarItem>
            </>
          ) : (
            <>
              <NavbarItem>
                <Link href='/auth/sign-in'>Login</Link>
              </NavbarItem>
              <NavbarItem>
                <Button as={Link} color='primary' href='#' variant='flat'>
                  Sign Up
                </Button>
              </NavbarItem>
            </>
          )}
        </NavbarContent>
      </Navbar>
    </header>
  );
}
