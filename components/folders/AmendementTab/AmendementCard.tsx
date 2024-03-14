"use client";
import * as React from "react";

import { Amendement } from "@/repository/types";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StatusChip from "@/components/StatusChip";
import CircleDiv from "@/icons/CircleDiv";
import { Avatar } from "@mui/material";

function getStatus(label: string) {
  switch (label) {
    case "Adopté":
      return "validated";
    case "Rejeté":
    case "Irrecevable":
    case "Tombé":
    case "Irrecevable 40":
      return "refused";
    case "Non soutenu":
    case "Retiré":
      return "dropped";
    default:
      return "review";
  }
}

export default function AmendementCard(props: Amendement) {
  const {
    dateDepot,
    dateSort,
    sortAmendement,
    etatCode,
    etatLibelle,
    sousEtatCode,
    sousEtatLibelle,
    dispositif,
    exposeSommaire,
    urlDivisionTexteVise,
    signatairesLibelle,
    numeroLong,
    acteur,
    prenom,
    nom,
    uid,
    group_color,
    group_libelle,
    group_libelle_short,
  } = props;

  // TODO: utiliser la base cosignataires amendement pour avoir le nombre et les noms
  const nbSignataires = signatairesLibelle.split("&#160;").length - 1;

  return (
    <Accordion
      elevation={0}
      disableGutters
      sx={(theme) => ({
        borderBottom: `solid ${theme.palette.divider} 1px`,
        borderRadius: 0,
      })}
    >
      <AccordionSummary
        aria-controls={`${uid}-pannel`}
        id={`${uid}-header`}
        expandIcon={<ExpandMoreIcon />}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ width: "100%", mr: 2 }}
        >
          <Avatar>
            {prenom[0]} {nom[0]}
          </Avatar>
          <Stack direction="column" flexGrow={1}>
            <span>
              {prenom} {nom}
            </span>
            <Stack direction="row" spacing={1} alignItems="center">
              <CircleDiv color={group_color} size={10} />
              <Typography fontWeight="light" variant="body2">
                {group_libelle}
              </Typography>
            </Stack>
          </Stack>

          <StatusChip
            size="small"
            label={sortAmendement || etatLibelle}
            status={getStatus(sortAmendement || etatLibelle)}
          />
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Stack direction="column" spacing={2}>
          <Typography variant="caption">N°{numeroLong}</Typography>
          <Typography
            fontWeight="light"
            variant="body2"
            flexGrow={1}
            flexShrink={1}
            flexBasis={0}
            component="div"
            sx={{ bgcolor: "grey.50", p: 1 }}
            dangerouslySetInnerHTML={{ __html: dispositif }}
          />

          <Typography fontWeight="light" variant="body2">
            Examiné par:&nbsp;
            <Typography component="a" variant="body2">
              Le nom d&apos;une commission parlementaire
            </Typography>
          </Typography>
          <Stack direction="row" justifyContent="space-between" flexBasis={0}>
            <Typography fontWeight="light" variant="body2">
              Déposé par:&nbsp;
              <Typography component="span" variant="body2">
                {nbSignataires} député{nbSignataires > 1 ? "s" : ""}
              </Typography>
            </Typography>

            <Typography fontWeight="light" variant="body2">
              Date de dépôt:&nbsp;
              <Typography component="span" variant="body2">
                {dateDepot.toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Typography>
            </Typography>

            <Typography fontWeight="light" variant="body2">
              Date d&apos;examen:&nbsp;
              <Typography component="span" variant="body2">
                {dateSort?.toLocaleDateString("fr-FR", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </Typography>
            </Typography>
          </Stack>
        </Stack>
      </AccordionDetails>
    </Accordion>
  );
}
