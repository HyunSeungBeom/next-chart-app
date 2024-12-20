import { fetchWithConfig } from "@/api";
import BookItem from "@/components/book-item";
import BookListSkeleton from "@/components/skeleton/book-list-skeleton";
import { BookData } from "@/types";
import { Metadata } from "next";
import { Suspense } from "react";

async function SearchResult({ q }: { q: string }) {
  const books: BookData[] = await fetchWithConfig(`/book/search?q=${q}`, {
    cache: "force-cache",
  });

  return (
    <div>
      {books.map((book) => (
        <BookItem key={book.id} {...book} />
      ))}
    </div>
  );
}

type Props = {
  searchParams: {
    q?: string;
  };
};

export function generateMetadata({ searchParams }: Props): Metadata {
  return {
    title: `${searchParams.q} : 한입북스 검색`,
    description: `${searchParams.q} 검색 결과입니다`,
    openGraph: {
      title: `${searchParams.q} : 한입북스 검색`,
      description: `${searchParams.q} 검색 결과입니다`,
      images: ["/thumbnail.png"],
    },
  };
}

export default function Page({ searchParams }: Props) {
  return (
    <Suspense
      key={searchParams.q || ""}
      fallback={<BookListSkeleton count={3} />}
    >
      <SearchResult q={searchParams.q || ""} />
    </Suspense>
  );
}
