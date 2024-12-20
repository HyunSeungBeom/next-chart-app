const baseUrl = process.env.NEXT_PUBLIC_API_SERVER_URL;

export const fetchWithConfig = async <T>(
  url: string,
  options: RequestInit
): Promise<T> => {
  try {
    if (!baseUrl) {
      throw new Error("API 서버 URL이 설정되지 않았습니다");
    }

    const response = await fetch(`${baseUrl}${url}`, {
      headers: {
        "Content-Type": "application/json",
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(
        `API 요청 실패: ${response.status} ${response.statusText}`
      );
    }

    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error(
      `API 요청 중 오류 발생: ${
        error instanceof Error ? error.message : "알 수 없는 오류"
      }`
    );
  }
};
