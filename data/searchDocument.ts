import { Document } from "@prisma/client";


type ClasseCode =
  | "ALLOCUTION"
  | "AVIS"
  | "DECLARATION"
  | "MOTION"
  | "PIONLOI"
  | "PIONRES"
  | "PRJLOI";

export const classesCodePossible = [
  '',
  "ALLOCUTION",
  "AVIS",
  "DECLARATION",
  "MOTION",
  "PIONLOI",
  "PIONRES",
  "PRJLOI",
]

interface SearchDocumentParams {
  /**
   * @default 10
   */
  perPage?: number;
  /**
   * @default 0
   */
  page?: number;
  /**
   * @default "dateCreation.asc"
   */
  sort?: string;
  include?: string;
  search?: string;
  classeCode?: ClasseCode;
  auteurPrincipalUid?: string;
  documentParentRefUid?: string;
  dossierRefUid?: string;
  organeRefUid?: string;
}

export async function searchDocument(
  params: SearchDocumentParams
): Promise<Document[] | null> {
  const {
    perPage = 10,
    page = 1,
    sort = "dateCreation.asc",
    search = "",
    include,
    classeCode,
    auteurPrincipalUid,
    documentParentRefUid,
    dossierRefUid,
    organeRefUid,
  } = params;

  const searchParams = new URLSearchParams({
    perPage: perPage.toString(),
    page: page.toString(),
    sort,
  });


  Object.entries({
    search,
    include,
    classeCode,
    auteurPrincipalUid,
    documentParentRefUid,
    dossierRefUid,
    organeRefUid,
  }).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value);
    }
  })

  try {
    const rep = await fetch(
      `${process.env.NEXT_PUBLIC_TRICOTEUSES_API_URL}/documents?${searchParams}`
    );

    const { data } = await rep.json();

    return data.map((item: Document) => ({ ...item, dateCreation: item.dateCreation ? new Date(item.dateCreation) : item.dateCreation })) ?? null
  } catch (error) {
    console.error("Error fetching documents:", error);
    return null;
  }
}
