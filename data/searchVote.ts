import { Vote } from "@prisma/client";


interface SearchVoteParams {
  /**
   * @default 10
   */
  perPage?: number;
  /**
   * @default 0
   */
  page?: number;
  /**
   * @default "numeroOrdreDepot.asc"
   */
  sort?: string;
  include?: string;
  search?: string;
  acteurRefUid?: string;
  codeTypeVote?: string;
  scrutinRefUid?: string;
  causePositionVote?: string;
  positionVote?: string;
}

export async function searchVote(
  params: SearchVoteParams
): Promise<Vote[] | null> {
  const {
    perPage = 10,
    page = 1,
    sort = "dateVote.asc",
    search = "",
    include,
    acteurRefUid,
    codeTypeVote,
    scrutinRefUid,
    causePositionVote,
    positionVote
  } = params;

  const searchParams = new URLSearchParams({
    perPage: perPage.toString(),
    page: page.toString(),
    sort,
  });


  Object.entries({
    search,
    include,
    acteurRefUid,
    codeTypeVote,
    scrutinRefUid,
    causePositionVote,
    positionVote
  }).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }

  })
  try {
    const rep = await fetch(
      `${process.env.NEXT_PUBLIC_TRICOTEUSES_API_URL}/votes?${searchParams}`
    );

    const { data } = await rep.json();

    return data ?? null;
  } catch (error) {
    console.error("Error fetching dossier:", error);
    return null;
  }
}
