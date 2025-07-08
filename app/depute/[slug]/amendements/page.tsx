"use client";
import React from "react";

import { useQuery } from "@tanstack/react-query";
import { searchAmendement } from "@/data/searchAmendement";
import { useParams } from "next/navigation";
import { getActeurBySlug } from "@/data/getActeurBySlug";

import AmendementCard from "@/components/folders/AmendementCard";

import SearchIcon from "@mui/icons-material/Search";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Select from "@mui/material/Select";
import Input from "@mui/material/Input";
import LinearProgress from "@mui/material/LinearProgress";
import MenuItem from "@mui/material/MenuItem";

import debounce from "@/utils/debounce";

const sortAmendementPossible = [
  "A discuter",
  "Adopté",
  "effacé",
  "En traitement",
  "Irrecevable",
  "Irrecevable 40",
  "Non soutenu",
  "Rejeté",
  "Retiré",
  "Satisfait ou sans objet",
  "Tombé",
] as const;

export default function Amendements() {
  const { slug } = useParams<{ slug: string }>();

  const { data: acteur } = useQuery({
    queryKey: ["acteur", slug],

    queryFn: async () => {
      const data = await getActeurBySlug(slug);
      return data;
    },
  });

  const [search, setSearch] = React.useState("");
  const [sortAmendement, setSortAmendement] = React.useState("");
  const [page, setPage] = React.useState(1);

  const { data, isPending } = useQuery({
    queryKey: ["amendements", page, acteur?.uid, sortAmendement, search],

    queryFn: async () => {
      if (!acteur?.uid) {
        return [];
      }
      const data = await searchAmendement({
        page,
        acteurRefUid: acteur?.uid,
        sortAmendement,
        search,
      });
      return data;
    },
  });
  const { data: nextPageData } = useQuery({
    queryKey: ["amendements", page + 1, acteur?.uid, sortAmendement, search],

    queryFn: async () => {
      if (!acteur?.uid) {
        return [];
      }
      const data = await searchAmendement({
        page: page + 1,
        acteurRefUid: acteur?.uid,
        sortAmendement,
        search,
      });
      return data;
    },
  });

  const hasNextPage = nextPageData && nextPageData?.length > 0;
  const debouncedSetSearch = React.useMemo(
    () =>
      debounce((newSearch) => {
        setSearch(newSearch);
        setPage(1);
      }, 500),
    []
  );

  if (acteur?.uid) {
    return (
      <div>
        <Stack direction="row">
          <Input
            onChange={(event) => debouncedSetSearch(event.target.value)}
            startAdornment={<SearchIcon />}
          />
          <Select
            value={sortAmendement}
            onChange={(event) => {
              setSortAmendement(event.target.value);
              setPage(1);
            }}
            label="Status"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">-</MenuItem>
            {sortAmendementPossible.map((sort) => (
              <MenuItem key={sort} value={sort}>
                {sort}
              </MenuItem>
            ))}
          </Select>
        </Stack>

        {isPending && <LinearProgress />}
        <Stack direction="row" justifyContent="space-between">
          <Button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            pev
          </Button>
          <Typography>page {page}</Typography>
          <Button disabled={!hasNextPage} onClick={() => setPage((p) => p + 1)}>
            next
          </Button>
        </Stack>
        {data?.map((amendement) => {
          const titre = `Amendement N°${amendement.numeroOrdreDepot}`;

          return (
            <AmendementCard
              key={amendement.uid}
              amendement={amendement}
              acteurUid={null}
              titre={titre}
            />
          );
        })}
      </div>
    );
  }
  return null;
}
