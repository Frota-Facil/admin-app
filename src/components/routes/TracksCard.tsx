"use client";

import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { TRACK_CREATED_EVENT } from "@/components/routes/RouteEventListener";
import type { RouteDetailDTO } from "@/server/contracts/routes/route-detail-schema";
import type { TrackCreatedEventDTO } from "@/server/contracts/tracks/track-created-event";

type TracksCardProps = {
  routeId: string;
  tracks: RouteDetailDTO["tracks"];
};

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  month: "2-digit",
  year: "numeric",
});

export function TracksCard({ routeId, tracks }: TracksCardProps) {
  const [trackList, setTrackList] = useState(tracks);

  useEffect(() => {
    setTrackList(tracks);
  }, [tracks]);

  useEffect(() => {
    function handleTrackCreated(event: Event) {
      const { detail } = event as CustomEvent<TrackCreatedEventDTO>;

      if (!detail || detail.routeId !== routeId) {
        return;
      }

      setTrackList((currentTracks) => {
        if (currentTracks.some((track) => track.id === detail.track.id)) {
          return currentTracks;
        }

        return [...currentTracks, detail.track];
      });
    }

    window.addEventListener(TRACK_CREATED_EVENT, handleTrackCreated);

    return () => {
      window.removeEventListener(TRACK_CREATED_EVENT, handleTrackCreated);
    };
  }, [routeId]);

  return (
    <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 px-5 py-4">
        <h2 className="text-base font-bold tracking-normal text-slate-950">
          Tracks
        </h2>
      </div>

      {trackList.length === 0 ? (
        <div className="p-10 text-center">
          <p className="text-sm font-medium text-slate-500">
            Nenhum track encontrado.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead className="bg-slate-50">
              <tr className="border-b border-slate-200">
                <TableHead>Capturado em</TableHead>
                <TableHead>Latitude</TableHead>
                <TableHead>Longitude</TableHead>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {trackList.map((track) => (
                <tr className="transition hover:bg-slate-50/80" key={track.id}>
                  <td className="whitespace-nowrap px-4 py-4 text-sm font-semibold text-slate-950">
                    {formatDateTime(track.capturedAt)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                    {track.latitude}
                  </td>
                  <td className="whitespace-nowrap px-4 py-4 text-sm text-slate-600">
                    {track.longitude}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

type TableHeadProps = {
  children: ReactNode;
};

function TableHead({ children }: TableHeadProps) {
  return (
    <th className="px-4 py-3 text-xs font-bold uppercase tracking-normal text-slate-500">
      {children}
    </th>
  );
}

function formatDateTime(value?: Date | string | null) {
  if (!value) {
    return "-";
  }

  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return dateTimeFormatter.format(date);
}
