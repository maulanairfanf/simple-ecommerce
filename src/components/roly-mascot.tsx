type RolyPose = "welcome" | "holding" | "shopping" | "empty" | "celebrate" | "confused";

type RolyMascotProps = {
  className?: string;
  pose?: RolyPose;
};

/** Original folded-bun mascot prototype. Future campaign art can replace this pose system. */
export function RolyMascot({ className, pose = "welcome" }: RolyMascotProps) {
  const armPath = {
    welcome: "M54 126c-22-19-31-35-35-48m147 49c25-13 37-29 40-42",
    holding: "M54 130c-17 4-26 15-31 30m143-30c18 6 28 18 32 31",
    shopping: "M54 127c-18-8-31-18-40-35m152 35c18-7 31-18 39-34",
    empty: "M53 133c-17 7-28 22-32 36m145-36c17 7 28 22 32 36",
    celebrate: "M54 124c-22-16-35-36-39-55m151 55c21-17 34-37 38-55",
    confused: "M55 133c-20-1-34 5-43 17m154-17c19-1 33 5 42 17",
  }[pose];

  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 220 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M47 128c8-46 34-74 65-74 36 0 58 27 65 74-19-7-39-11-65-11-25 0-43 4-65 11Z"
        fill="#F8C84A"
        stroke="#182E85"
        strokeWidth="7"
        strokeLinejoin="round"
      />
      <path
        d="M61 111c15-14 31-20 51-20 21 0 36 6 50 20M71 83c10 9 23 13 41 13 19 0 32-4 42-13"
        stroke="#A96D43"
        strokeWidth="7"
        strokeLinecap="round"
      />
      <ellipse cx="89" cy="136" rx="5" ry="7" fill="#182E85" />
      <ellipse cx="134" cy="136" rx="5" ry="7" fill="#182E85" />
      {pose === "confused" ? (
        <path d="M99 158c8-7 17-7 25 0" stroke="#182E85" strokeWidth="5" strokeLinecap="round" />
      ) : (
        <path d="M99 153c7 8 17 8 25 0" stroke="#182E85" strokeWidth="5" strokeLinecap="round" />
      )}
      <path d={armPath} stroke="#182E85" strokeWidth="9" strokeLinecap="round" />
      {pose === "holding" && (
        <path
          d="M59 157h106v31H59z"
          fill="#FFF9EF"
          stroke="#182E85"
          strokeWidth="6"
          strokeLinejoin="round"
        />
      )}
      {pose === "shopping" && (
        <path
          d="M19 92h25l10 44h83l11-29H61"
          stroke="#182E85"
          strokeWidth="6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      {pose === "empty" && (
        <path
          d="M38 172c24-15 47-15 70 0 24-15 48-15 73 0"
          stroke="#182E85"
          strokeWidth="5"
          strokeDasharray="6 7"
          strokeLinecap="round"
        />
      )}
      {pose === "celebrate" && (
        <path
          d="M32 53l7 13m17-25 2 15m102-4-7 13m-17-25-2 15"
          stroke="#F8C84A"
          strokeWidth="7"
          strokeLinecap="round"
        />
      )}
      <path d="M82 171v24m55-24v24" stroke="#182E85" strokeWidth="9" strokeLinecap="round" />
    </svg>
  );
}
