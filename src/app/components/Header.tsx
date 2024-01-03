"use client";
import {Navbar, NavbarBrand, NavbarContent, NavbarItem, Link, Button, DropdownItem, DropdownTrigger, Dropdown, DropdownMenu} from "@nextui-org/react";
// import Link from "next/link";
import { useSession } from 'next-auth/react';


export default function Header() {
    const { data: data, status } = useSession();

    console.log("status", status)
    return (
        <header>
            <Navbar>
                <NavbarBrand>
                    <p className="font-bold text-inherit">MLG</p>
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    {status === "authenticated" && data !== undefined ? (
                        <Dropdown>
                            <NavbarItem>
                                <DropdownTrigger>
                                    <Button>Create</Button>
                                </DropdownTrigger>
                            </NavbarItem>
                            <DropdownMenu>
                                <DropdownItem key="tournaments" className="test hover:border-pink-500 hover:border-2" >
                                    <Link  href="/create/tournaments">Tournaments</Link>
                                </DropdownItem>
                                <DropdownItem className=" border-pink-700"  key="game_category">
                                    <Link className=" border-pink-700"  href="/create/game-category">Game Category</Link>
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    ) : (
                        <>
                            <NavbarItem className="hidden lg:flex">
                                <Link href="#">Login</Link>
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
    )
}