import { Client, Databases, ID, Query } from "appwrite";
//https://appwrite.io/docs/products/databases/quick-start , https://appwrite.io/docs/references/cloud/client-web/databases

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID; //放係.env.local
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const COLLECTION_ID = import.meta.env.VITE_APPWRITE_COLLECTION_ID;

const client = new Client() //網quick-start步驟
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const database = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
  // 1. 用listdocuments睇searchTerm值是否存在
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.equal("searchTerm", searchTerm),
    ]);

    // 2. Yes->更新值
    if (result.documents.length > 0) {
      const doc = result.documents[0]; //第一個結果

      await database.updateDocument(DATABASE_ID, COLLECTION_ID, doc.$id, {
        count: doc.count + 1, //更新值 https://appwrite.io/docs/references/cloud/client-web/databases
      });
      // 3. No->生成值並設count為1
    } else {
      // 生成新值 https://appwrite.io/docs/products/databases/quick-start
      await database.createDocument(DATABASE_ID, COLLECTION_ID, ID.unique(), {
        searchTerm,
        count: 1,
        movie_id: movie.id,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

export const getTrendingMovies = async () => {
  try {
    const result = await database.listDocuments(DATABASE_ID, COLLECTION_ID, [
      Query.limit(5),
      Query.orderDesc("count"),
    ]);

    return result.documents;
  } catch (error) {
    console.error(error);
  }
};
