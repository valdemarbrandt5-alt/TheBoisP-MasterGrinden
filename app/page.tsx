"use client";

import { useEffect, useState } from "react";

function rankColor(tier: string) {
  const colors: Record<string, string> = {
    CHALLENGER: "text-yellow-300 border-yellow-300/40 bg-yellow-300/10",
    GRANDMASTER: "text-red-400 border-red-400/40 bg-red-400/10",
    MASTER: "text-purple-400 border-purple-400/40 bg-purple-400/10",
    DIAMOND: "text-cyan-300 border-cyan-300/40 bg-cyan-300/10",
    EMERALD: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10",
    PLATINUM: "text-teal-300 border-teal-300/40 bg-teal-300/10",
    GOLD: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",
    SILVER: "text-zinc-300 border-zinc-300/40 bg-zinc-300/10",
    BRONZE: "text-orange-500 border-orange-500/40 bg-orange-500/10",
    IRON: "text-stone-400 border-stone-400/40 bg-stone-400/10",
    UNRANKED: "text-zinc-500 border-zinc-500/40 bg-zinc-500/10",
    ERROR: "text-red-500 border-red-500/40 bg-red-500/10",
  };

  return colors[tier] ?? colors.UNRANKED;
}

function statColor(value: number, best: number, worst: number, reverse = false) {
  if (best === worst) return "text-white";

  if (!reverse) {
    if (value === best) return "text-green-400 font-bold";
    if (value === worst) return "text-red-400 font-bold";
  } else {
    if (value === best) return "text-red-400 font-bold";
    if (value === worst) return "text-green-400 font-bold";
  }

  return "text-zinc-200";
}

function formatDate(timestamp: number) {
  if (!timestamp) return "Ukendt dato";

  return new Date(timestamp).toLocaleDateString("da-DK", {
    day: "2-digit",
    month: "2-digit",
  });
}

export default function Home() {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function loadData() {
    const res = await fetch("/api/leaderboard");
    const data = await res.json();
    setPlayers(data);
  }

  async function refreshData() {
    try {
      setLoading(true);
      setMessage("Opdaterer stats...");

      const res = await fetch("/api/refresh", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage("Noget gik galt under refresh.");
        return;
      }

      setPlayers(data);
      setMessage("Stats opdateret.");
    } catch {
      setMessage("Refresh fejlede. Riot er nok sur igen.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
    }, []);

  const bestWinrate = players.length
    ? Math.max(...players.map((p) => p.winrate ?? 0))
    : 0;
  const worstWinrate = players.length
    ? Math.min(...players.map((p) => p.winrate ?? 0))
    : 0;

  const bestKda = players.length ? Math.max(...players.map((p) => p.kda ?? 0)) : 0;
  const worstKda = players.length ? Math.min(...players.map((p) => p.kda ?? 0)) : 0;

  const bestDamage = players.length
    ? Math.max(...players.map((p) => p.avgDamage ?? 0))
    : 0;
  const worstDamage = players.length
    ? Math.min(...players.map((p) => p.avgDamage ?? 0))
    : 0;

  const bestDeaths = players.length
    ? Math.max(...players.map((p) => p.avgDeaths ?? 0))
    : 0;
  const worstDeaths = players.length
    ? Math.min(...players.map((p) => p.avgDeaths ?? 0))
    : 0;

  const mostTrackedGames = players.length
    ? Math.max(...players.map((p) => p.trackedGames ?? 0))
    : 0;

  const topRanked = players[0];

  return (
    <main className="min-h-screen bg-zinc-950 text-white p-8">
      <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-5xl font-black">Flex Master Tracker</h1>
          <p className="text-zinc-400 mt-2">
            Ladder, stats og beviser på hvem der faktisk bærer flex-drømmen.
          </p>
        </div>

        <div className="flex flex-col items-start md:items-end gap-2">
          <button
            onClick={refreshData}
            disabled={loading}
            className="rounded-xl bg-emerald-500 px-5 py-3 font-bold text-black hover:bg-emerald-400 disabled:opacity-50"
          >
            {loading ? "Opdaterer..." : "Opdater stats"}
          </button>

          {message && <div className="text-sm text-zinc-400">{message}</div>}
        </div>
      </div>

      {players.length === 0 ? (
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-zinc-400">
          Ingen data endnu. Tryk <span className="text-emerald-400">Opdater stats</span>.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="text-zinc-400 text-sm">Højeste rank</div>
              <div className="text-2xl font-bold">{topRanked?.name}</div>
              <div className="text-zinc-400">
                {topRanked?.tier} {topRanked?.rank} {topRanked?.lp} LP
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="text-zinc-400 text-sm">Bedste winrate</div>
              <div className="text-2xl font-bold text-green-400">
                {players.find((p) => p.winrate === bestWinrate)?.name}
              </div>
              <div className="text-zinc-400">{bestWinrate}%</div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="text-zinc-400 text-sm">Bedste KDA</div>
              <div className="text-2xl font-bold text-green-400">
                {players.find((p) => p.kda === bestKda)?.name}
              </div>
              <div className="text-zinc-400">{bestKda}</div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="text-zinc-400 text-sm">Mest død</div>
              <div className="text-2xl font-bold text-red-400">
                {players.find((p) => p.avgDeaths === bestDeaths)?.name}
              </div>
              <div className="text-zinc-400">{bestDeaths} deaths/game</div>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="text-zinc-400 text-sm">Tracked games</div>
              <div className="text-2xl font-bold">{mostTrackedGames}</div>
              <div className="text-zinc-400">siden reset</div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-zinc-800 bg-zinc-950">
            <table className="w-full min-w-[1150px] text-left">
              <thead className="bg-zinc-900 text-zinc-300">
                <tr>
                  <th className="p-4">#</th>
                  <th className="p-4">Spiller</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Flex Rank</th>
                  <th className="p-4">Season W/L</th>
                  <th className="p-4">Season WR</th>
                  <th className="p-4">Tracked Games</th>
                  <th className="p-4">KDA</th>
                  <th className="p-4">Avg K/D/A</th>
                  <th className="p-4">Damage</th>
                  <th className="p-4">CS/min</th>
                  <th className="p-4">Vision</th>
                </tr>
              </thead>

              <tbody>
                {players.map((p, index) => (
                  <tr
                    key={p.name}
                    className="border-t border-zinc-800 hover:bg-zinc-900/60"
                  >
                    <td className="p-4 font-bold text-xl">{index + 1}</td>

                    <td className="p-4">
                      <div className="font-bold text-lg">{p.name}</div>
                      <div className="text-sm text-zinc-500">
                        {p.gameName}#{p.tagLine}
                      </div>
                      {p.error && (
                        <div className="text-xs text-red-400 mt-1">{p.error}</div>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-sm">
                        {p.mainRole} / {p.secondRole}
                      </span>
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full border px-3 py-1 font-bold ${rankColor(
                          p.tier
                        )}`}
                      >
                        {p.tier} {p.rank} {p.lp} LP
                      </span>
                    </td>

                    <td className="p-4">
                      {p.wins}W / {p.losses}L
                    </td>

                    <td
                      className={`p-4 ${statColor(
                        p.winrate,
                        bestWinrate,
                        worstWinrate
                      )}`}
                    >
                      {p.winrate}%
                    </td>

                    <td className="p-4">{p.trackedGames}</td>

                    <td className={`p-4 ${statColor(p.kda, bestKda, worstKda)}`}>
                      {p.kda}
                    </td>

                    <td className="p-4">
                      <span className="text-green-400">{p.avgKills}</span>
                      <span className="text-zinc-500"> / </span>
                      <span
                        className={statColor(
                          p.avgDeaths,
                          bestDeaths,
                          worstDeaths,
                          true
                        )}
                      >
                        {p.avgDeaths}
                      </span>
                      <span className="text-zinc-500"> / </span>
                      <span className="text-sky-400">{p.avgAssists}</span>
                    </td>

                    <td
                      className={`p-4 ${statColor(
                        p.avgDamage,
                        bestDamage,
                        worstDamage
                      )}`}
                    >
                      {p.avgDamage?.toLocaleString()}
                    </td>

                    <td className="p-4">{p.avgCsMin}</td>

                    <td className="p-4">{p.avgVision}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-zinc-500 text-sm mt-4">
            Rank, W/L og season WR er hele Flex season. KDA, damage, CS/min,
            vision og recent games tæller kun games efter reset.
          </p>

          <div className="mt-10 space-y-6">
            {players.map((p) => (
              <div
                key={p.name}
                className="rounded-2xl border border-zinc-800 bg-zinc-900 p-5"
              >
                <div className="mb-4 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{p.name}</h2>
                    <p className="text-sm text-zinc-500">Seneste tracked games</p>
                  </div>

                  <div className="text-sm text-zinc-500">
                    {p.recentMatches?.length ?? 0} games vist
                  </div>
                </div>

                <div className="space-y-2">
                  {p.recentMatches?.length > 0 ? (
                    p.recentMatches.map((match: any, i: number) => (
                      <div
                        key={i}
                        className="flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 md:flex-row md:items-center md:justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <span
                            className={`rounded-lg px-3 py-1 text-sm font-bold ${
                              match.win
                                ? "bg-emerald-500/15 text-emerald-400"
                                : "bg-red-500/15 text-red-400"
                            }`}
                          >
                            {match.win ? "WIN" : "LOSS"}
                          </span>

                          <div>
                            <div className="font-semibold">{match.champion}</div>
                            <div className="text-sm text-zinc-500">
                              {match.kills}/{match.deaths}/{match.assists}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm md:gap-6">
                          <div className="text-zinc-300">
                            {match.damage?.toLocaleString()} dmg
                          </div>

                          <div className="text-zinc-300">{match.csMin} CS/min</div>

                          <div className="text-zinc-500">
                            {formatDate(match.timestamp)}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="rounded-xl border border-zinc-800 bg-zinc-950 px-4 py-3 text-zinc-500 text-sm">
                      Ingen tracked games endnu.
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </main>
  );
}