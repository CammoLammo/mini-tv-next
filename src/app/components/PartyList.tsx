"use client";

import { useEffect, useState } from "react";

interface Party {
    id: number;
    date: string;
    time: string;
    endTime: string;
    endRoxbyTime: string;
    endGympieTime: string;
    datetime: string;
    childName: string;
    room: string;
}

interface SectionData {
    section: string;
    party?: Party;
}

export default function PartyList() {
    const [parties, setParties] = useState<Party[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        async function fetchParties() {
            try {
                const getDate = currentTime.toISOString().split("T")[0];
                const response = await fetch(`/api/parties?date=${getDate}`);

                if (!response.ok) {
                    throw new Error("Failed to fetch parties");
                }

                const data = await response.json();

                setParties(data.parties);
            } catch (error: unknown) {
                setError(
                    error instanceof Error
                        ? error.message
                        : "An unknown error occurred"
                );
            } finally {
                setLoading(false);
            }
        }
        fetchParties();
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000);
        return () => clearInterval(timer);
    }, []);

    let floorRoxby: SectionData = { section: "Roxby Side" };
    let floorGympie: SectionData = { section: "Gympie Side" };
    let room1: SectionData = { section: "Room 1" };
    let room2: SectionData = { section: "Room 2" };
    let room3: SectionData = { section: "Room 3" };
    let room4: SectionData = { section: "Room 4" };

    parties.forEach((party) => {
        const startTime = new Date(party.datetime);
        const diffMins = (currentTime.getTime() - startTime.getTime()) / 60000;

        if (diffMins >= 0 && diffMins < 120) {
            if (party.room === "1") {
                room1 = { section: "Room 1", party: party };
            } else if (party.room === "2") {
                room2 = { section: "Room 2", party: party };
            } else if (party.room === "3") {
                room3 = { section: "Room 3", party: party };
            } else if (party.room === "4") {
                room4 = { section: "Room 4", party: party };
            }

            if (diffMins < 30) {
                floorRoxby = { section: "Roxby Side", party: party };
            } else if (diffMins < 60) {
                floorGympie = { section: "Gympie Side", party: party };
            }
        }
    });

    const diffCasual1 =
        (currentTime.getTime() -
            new Date(
                currentTime.getFullYear(),
                currentTime.getMonth(),
                currentTime.getDate(),
                11,
                0,
                0
            ).getTime()) /
        60000;
    const diffCasual2 =
        (currentTime.getTime() -
            new Date(
                currentTime.getFullYear(),
                currentTime.getMonth(),
                currentTime.getDate(),
                13,
                30,
                0
            ).getTime()) /
        60000;

    const casualParty1 = {
        id: 1,
        date: "abc",
        endTime: "12:00pm",
        childName: "Casual Play",
        endRoxbyTime: "11:30am",
        endGympieTime: "12:00pm",
        time: "11:00am",
        datetime: "abc",
        room: "abc",
    };
    const casualParty2 = {
        id: 2,
        date: "abc",
        endTime: "2:30pm",
        childName: "Casual Play",
        endRoxbyTime: "2:00pm",
        endGympieTime: "2:30pm",
        time: "1:30pm",
        datetime: "abc",
        room: "abc",
    };

    if (diffCasual1 >= 0 && diffCasual1 <= 60) {
        if (diffCasual1 >= 30) {
            floorGympie = { section: "Gympie Side", party: casualParty1 };
        } else {
            floorRoxby = { section: "Roxby Side", party: casualParty1 };
        }
    }

    if (diffCasual2 >= 0 && diffCasual2 <= 60) {
        if (diffCasual2 >= 30) {
            floorGympie = { section: "Gympie Side", party: casualParty2 };
        } else {
            floorRoxby = { section: "Roxby Side", party: casualParty2 };
        }
    }

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="min-h-screen grid grid-cols-2 text-center align-middle font-bold text-3xl bg-black text-white">
            <p className="bg-green-700 m-4 rounded-lg flex items-center justify-center">
                {room1.party ? (
                    <>
                        Room 1 <br /> {room1.party.childName} <br />
                        {room1.party.time} - {room1.party.endTime}
                    </>
                ) : (
                    <>
                        Room 1 <br /> No Party
                    </>
                )}
            </p>

            <p className="bg-green-700 m-4 rounded-lg flex items-center justify-center">
                {room2.party ? (
                    <>
                        Room 2 <br /> {room2.party.childName} <br />
                        {room2.party.time} - {room2.party.endTime}
                    </>
                ) : (
                    <>
                        Room 2 <br /> No Party
                    </>
                )}
            </p>

            <p className="bg-cyan-800 col-span-2 m-4 rounded-lg flex items-center justify-center">
                {floorRoxby.party ? (
                    <>
                        {" "}
                        Playing on Roxby Side (Bouncy Castle)
                        <br /> {floorRoxby.party.childName} <br />
                        {floorRoxby.party.time} -{" "}
                        {floorRoxby.party.endRoxbyTime}
                    </>
                ) : (
                    <>
                        Playing on Roxby Side (Bouncy Castle) <br /> No Party
                    </>
                )}
            </p>

            <p className="bg-cyan-800 col-span-2 m-4 rounded-lg flex items-center justify-center">
                {floorGympie.party ? (
                    <>
                        Playing on Gympie Side (Foam Pits) <br />
                        {floorGympie.party.childName} <br />
                        {floorGympie.party.endRoxbyTime} -{" "}
                        {floorGympie.party.endGympieTime}
                    </>
                ) : (
                    <>
                        Playing on Gympie Side (Foam Pits) <br /> No Party
                    </>
                )}
            </p>

            <p className="bg-yellow-700 m-4 rounded-lg flex items-center justify-center">
                {room3.party ? (
                    <>
                        Room 3 <br /> {room3.party.childName}
                        <br />
                        {room3.party.time} - {room3.party.endTime}
                    </>
                ) : (
                    <>
                        Room 3 <br /> No Party
                    </>
                )}
            </p>

            <p className="bg-yellow-700 m-4 rounded-lg flex items-center justify-center">
                {room4.party ? (
                    <>
                        Room 4 <br /> {room4.party.childName} <br />
                        {room4.party.time} - {room4.party.endTime}
                    </>
                ) : (
                    <>
                        Room 4 <br /> No Party
                    </>
                )}
            </p>
        </div>
    );
}
