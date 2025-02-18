import { NextResponse } from "next/server";
import axios from "axios";

export async function GET(request: Request): Promise<Response> {
    try {
        const { searchParams } = new URL(request.url);
        const appointmentDate =
            searchParams.get("date") || new Date().toISOString();

        const acuityUrl = `https://acuityscheduling.com/api/v1/appointments?max=100&minDate=${appointmentDate}&appointmentTypeID=60238709&maxDate=${appointmentDate}&cancelled=false&excludeForms=false&direction=DESC`;

        const response = await fetch(acuityUrl, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${process.env.ACUITY_API_KEY}`,
            },
        });
        if (!response.ok) {
            throw new Error("Failed to fetch appointments");
        }

        const appointments = await response.json();

        const parties = (appointments as any[]).map((appointment) => {
            let partyRoom = "";

            if (appointment.calendar) {
                const roomNameArray = appointment.calendar.split(" ");
                const roomIndex = roomNameArray.indexOf("Room");
                if (roomIndex !== -1 && roomNameArray.length > roomIndex + 1) {
                    partyRoom = roomNameArray[roomIndex + 1];
                }
            }
            return {
                id: appointment.id,
                date: appointment.date,
                time: appointment.time,
                datetime: appointment.datetime,
                childName: appointment.forms[0].values[0].value,
                room: partyRoom,
            };
        });
        return new Response(JSON.stringify({ parties }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: any) {
        console.error("Error fetching Acuity data:", error);
        return new Response(
            JSON.stringify({ error: "Internal Server Error" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
