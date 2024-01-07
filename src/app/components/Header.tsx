"use client";
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
} from "@nextui-org/react";
import { signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: data, status } = useSession();

  console.log("data", data)

  return (
    <header>
      <Navbar>
        <NavbarBrand>
          <Link href="/" className="font-bold text-inherit">
            MLG
          </Link>
        </NavbarBrand>
        <NavbarContent className="gap-4" justify="center">
          {status === "authenticated" && data !== undefined  && data.user.role === 'admin' ? (
            <>
              <Dropdown>
                <NavbarItem>
                  <DropdownTrigger>
                    <Button>Create</Button>
                  </DropdownTrigger>
                </NavbarItem>
                <DropdownMenu aria-label="create">
                  <DropdownItem
                    key="tournaments"
                    className="test hover:border-pink-500 hover:border-2"
                    aria-label="tournaments"
                  >
                    <Link href="/create/tournaments">Tournaments</Link>
                  </DropdownItem>
                  <DropdownItem 
                    className=" border-pink-700" 
                    key="game_category"
                    aria-label="game_category"
                  >
                    <Link
                      className=" border-pink-700"
                      href="/create/game-category"
                    >
                      Game Category
                    </Link>
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <NavbarItem>
                <Button as={Link} color="primary" onClick={() => { signOut()}} variant="flat">Log Out</Button>
              </NavbarItem>
            </>
            
          ) : (
            <>
              <NavbarItem>
                <Link href="/auth/sign-in">Login</Link>
              </NavbarItem>
              <NavbarItem>
                <Button as={Link} color="primary" href="#" variant="flat">
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
