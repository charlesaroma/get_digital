/* A category's nominees as portrait cards. With live counts on, 1st stands alone, then 2nd and 3rd,
   then everyone else; every card is the same width so the rows centre and line up. */
import NomineeCard from "./NomineeCard";

const CARD = "w-[calc(50%-0.5rem)] sm:w-48 lg:w-52";

export default function Leaderboard({ nominees, showCounts, canVote, hrefFor, onVote, isWinner }) {
  const rows = showCounts ? [nominees.slice(0, 1), nominees.slice(1, 3), nominees.slice(3)] : [nominees];
  return (
    <div className="mt-8 flex flex-col gap-10">
      {rows.filter((r) => r.length).map((row, r) => (
        <ol key={r} className="flex flex-wrap justify-center gap-x-4 gap-y-8 md:gap-x-6">
          {row.map((n) => (
            <NomineeCard
              key={n.id}
              nominee={n}
              rank={nominees.indexOf(n) + 1}
              href={hrefFor(n)}
              showCounts={showCounts}
              canVote={canVote}
              winner={isWinner(n)}
              onVote={() => onVote(n)}
              className={CARD}
            />
          ))}
        </ol>
      ))}
    </div>
  );
}
