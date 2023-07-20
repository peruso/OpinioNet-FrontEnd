'use client';
import Posts from "@/components/Posts";
import PageWrapper from "@/components/PageWrapper";
import InfiniteScroll from 'react-infinite-scroll-component';
import {useState, useEffect} from "react";

export default function Home() {
    // const posts = await GetPosts();
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // Function to fetch data for the specified page
    const fetchData = async (page) => {
        try {
            const res = await fetch(`https://opinio-net-api-794h.vercel.app/api/api/microposts?page=${page}`, {
                cache: 'no-store',
            });
            if (!res.ok) {
                throw new Error(res.statusText);
            }
            return await res.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    };

    // Function to load more data when scrolling
    const loadMorePosts = async () => {
        const nextPage = page + 1;
        const newPosts = await fetchData(nextPage);

        if (newPosts.prev_page_url === null) {
            setPosts((post) => [...post, ...newPosts]);
            setPage(nextPage);
        } else {
            setHasMore(false); // No more data to load
        }
    };

    useEffect(() => {
        // Load initial data on component mount
        fetchData(page)
            .then(initialData => {
                setPosts(initialData.data);
            });
    });

    return (
        <PageWrapper>
            <main className="px-4 pb-20 background-colour">
                <InfiniteScroll next={loadMorePosts} hasMore={hasMore} loader={<p>Loading...</p>}
                                dataLength={posts.length}>
                    <Posts posts={posts} pageTitle={"Feed"}/>
                </InfiniteScroll>
            </main>
        </PageWrapper>
    )
}
