import { fetchWithConfig } from "@/api";
import style from "./page.module.css";
import { BookData, ReviewData } from "@/types";
import ReviewItem from "@/components/review-item";
import ReviewEditor from "@/components/review-editor";
import Image from "next/image";
import { Metadata } from "next";

// export const dynamicParams = false;
// static하게 만들려고 id값불러와서 return
// ({id: '1'}, {id: '2'}), {id: '3'}
export async function generateStaticParams() {
  const books: BookData[] = await fetchWithConfig("/book", {
    cache: "force-cache",
  });

  return books.map((book) => ({
    id: book.id.toString(),
  }));
}

async function BookDetail({ bookId }: { bookId: string }) {
  const book: BookData = await fetchWithConfig(`/book/${bookId}`, {
    cache: "force-cache",
  });

  const { id, title, subTitle, description, author, publisher, coverImgUrl } =
    book;

  return (
    <section>
      <div
        className={style.cover_img_container}
        style={{ backgroundImage: `url('${coverImgUrl}')` }}
      >
        <Image
          src={coverImgUrl}
          width={240}
          height={300}
          alt={`도서 ${title}의 표지 이미지`}
        />
      </div>
      <div className={style.title}>{title}</div>
      <div className={style.subTitle}>{subTitle}</div>
      <div className={style.author}>
        {author} | {publisher}
      </div>
      <div className={style.description}>{description}</div>
    </section>
  );
}

async function ReviewList({ bookId }: { bookId: string }) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/review/book/${bookId}`,
    { next: { tags: [`review-${bookId}`] } }
  );

  if (!response.ok) {
    throw new Error(`Review fetch failed : ${response.statusText}`);
  }

  const reviews: ReviewData[] = await response.json();

  return (
    <section>
      {reviews.map((review) => (
        <ReviewItem key={`review-item-${review.id}`} {...review} />
      ))}
    </section>
  );
}

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata | null> {
  const book: BookData = await fetchWithConfig(`/book/${params.id}`, {
    cache: "force-cache",
  });

  return {
    title: `${book.title} - 한입북스`,
    description: `${book.description}`,
    openGraph: {
      title: `${book.title} - 한입북스`,
      description: `${book.description}`,
      images: [book.coverImgUrl],
    },
  };
}

export default function Page({ params }: { params: { id: string } }) {
  return (
    <div className={style.container}>
      <BookDetail bookId={params.id} />
      <ReviewEditor bookId={params.id} />
      <ReviewList bookId={params.id} />
    </div>
  );
}
