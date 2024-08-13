import * as React from "react";
import { prisma } from "@/prisma";
import { DebateSummary } from "@/app/[legislature]/dossier/[id]/debat/[compteRenduRef]/DebateSummary";
import { SUMMARY_CODES } from "@/components/const";
import { DebateTranscript } from "./DebateTranscript";

async function getParagraphesUnCached(
  compteRenduRef: string,
  dossierUid: string
) {
  try {
    const agenda = await prisma.agenda.findFirst({
      where: {
        compteRenduRef,
      },
      include: {
        pointsOdj: {
          orderBy: { uid: "asc" },
          where: {
            etat: { equals: "Confirmé" },
          },
        },
      },
    });

    const points = agenda?.pointsOdj;

    const index =
      (points!.findIndex((pt) => pt.dossierLegislatifUid === dossierUid) ??
        -1) + 1;

    if (!index) {
      return { agenda, paragraphes: null };
    }

    const paragraphes = await prisma.paragraphe.findMany({
      where: {
        debatRefUid: compteRenduRef,
        valeurPtsOdj: index.toString(),
      },
      include: {
        acteur: {
          include: { groupeParlementaire: true },
        },
      },
      orderBy: { ordreAbsoluSeance: "asc" },
    });

    return { agenda, paragraphes };
  } catch (error) {
    console.error("Error fetching depute:", error);
    throw error;
  }
}

const getParagraphes = React.cache(getParagraphesUnCached);

export default async function Page({ params }: any) {
  const { id: dossierUid, compteRenduRef } = params;

  const { agenda, paragraphes } = await getParagraphes(
    compteRenduRef,
    dossierUid
  );

  if (!paragraphes || paragraphes.length === 0) {
    return <p>Aucun debat trouvé pour cette seance.</p>;
  }

  let lastHash = "init";

  const wordsCounts: Record<string, number> = paragraphes.reduce(
    (acc, paragraphe) => {
      const { codeGrammaire, texte } = paragraphe;

      if (SUMMARY_CODES.includes(codeGrammaire!)) {
        lastHash = paragraphe.hash;
        return { ...acc, [lastHash]: 0 };
      }

      if (["PAROLE_GENERIQUE", "INTERRUPTION_1_10"].includes(codeGrammaire!)) {
        const texteLength = texte ? texte.split(" ").length : 0;
        return {
          ...acc,
          [lastHash]: acc[lastHash] + texteLength,
        };
      }
      return acc;
    },
    {
      init: 0,
    } as Record<string, number>
  );

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 24,
          flex: 2,
        }}
      >
        <DebateSummary
          wordsCounts={wordsCounts}
          sections={paragraphes.filter((p) =>
            SUMMARY_CODES.includes(p.codeGrammaire!)
          )}
        />
      </div>
      <div style={{ display: "flex", flexDirection: "column", flex: 5 }}>
        <DebateTranscript
          title={`${
            agenda?.libelleCourtLieu ?? agenda?.libelleLongLieu ?? ""
          }, le ${
            agenda?.timestampDebut?.toLocaleString("fr-FR", {
              month: "long",
              day: "numeric",
              weekday: "long",
              year: "numeric",
              hour: "numeric",
              minute: "2-digit",
            }) ?? ""
          }`}
          paragraphs={paragraphes}
          wordsCounts={wordsCounts}
        />
      </div>
    </>
  );
}