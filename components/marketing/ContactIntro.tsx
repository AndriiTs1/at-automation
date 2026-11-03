import { useTranslations } from "next-intl";

type ContactIntroProps = {
  /** "section": the page's closing block (eyebrow, large headline, stacked points).
   *  "modal": the consultation dialog (no eyebrow, smaller headline, points in one row). */
  variant: "section" | "modal";
  /** Headline id, so the dialog can point aria-labelledby at it. */
  titleId?: string;
};

/**
 * Headline, description and the three reassurance points shared by ContactSection and
 * ContactModal, so the two ways into the consultation form can't drift apart. No "use client":
 * it renders as a server component under ContactSection and as a client one under ContactModal.
 */
export default function ContactIntro({ variant, titleId }: ContactIntroProps) {
  const t = useTranslations("Contact");
  const points = t.raw("points") as string[];
  const modal = variant === "modal";

  return (
    <div className={modal ? "pr-8 text-left" : "text-center sm:text-left"}>
      {!modal && <p className="text-sm font-semibold tracking-widest text-accent uppercase">{t("eyebrow")}</p>}
      <h2
        id={titleId}
        className={
          modal
            ? "text-2xl font-bold tracking-tight text-foreground md:text-3xl"
            : "mt-2.5 text-3xl font-bold tracking-tight text-foreground md:text-4xl"
        }
      >
        {t("headline")}
      </h2>
      <p className={modal ? "mt-2 text-base text-neutral-600" : "mt-3 text-base text-neutral-600 md:text-lg"}>{t("body")}</p>
      <ul
        className={
          modal
            ? "mt-4 flex flex-col gap-1.5 sm:flex-row sm:flex-wrap sm:gap-x-5"
            : "mt-6 flex flex-col items-center gap-2 sm:items-start"
        }
      >
        {points.map((point) => (
          <li key={point} className={`flex items-baseline gap-2 text-neutral-600 ${modal ? "text-sm" : "text-base"}`}>
            <span aria-hidden="true" className="text-accent">
              ·
            </span>
            <span>{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
