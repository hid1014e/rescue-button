'use client';

import { Box, Container, VStack, Heading, Text, Button, HStack, Badge } from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';

const THEME_LABELS: Record<string, string> = {
  'work-study': '仕事・勉強の悩み',
  'relationships': '人間関係の悩み',
  'future-anxiety': '将来への不安',
  'failure': 'ちょっとした失敗・落ち込み',
  'general': 'とにかく励ましてほしい',
};

interface Post {
  id: string;
  theme: string;
  content: string;
  anonymous_id: string;
  created_at: string;
}

function PostsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = searchParams?.get('theme') || '';
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (theme) {
      fetchPosts();
    }
  }, [theme]);

  const fetchPosts = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('rescue_posts')
        .select('*')
        .eq('theme', theme)
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('投稿取得エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEncourage = (postId: string) => {
    router.push(`/encourage?postId=${postId}`);
  };

  const handleNewPost = () => {
    router.push(`/post/create?theme=${theme}`);
  };

  const bgGradient = 'linear-gradient(180deg, #2d1b4e 0%, #1a1a2e 50%, #16213e 100%)';

  if (!theme) {
    return (
      <Box minH="100vh" bg={bgGradient} backgroundAttachment="fixed" py={12}>
        <Container maxW="container.md">
          <VStack gap={4}>
            <Text color="gray.300">テーマが選択されていません</Text>
            <Button colorScheme="pink" borderRadius="full" onClick={() => router.push('/theme-select')}>
              テーマを選ぶ
            </Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bgGradient} backgroundAttachment="fixed" py={12}>
      <Container maxW="container.md">
        <VStack gap={8} align="stretch">
          <VStack gap={4} textAlign="center">
            <Heading
              as="h1"
              size="xl"
              fontWeight="800"
              bg="linear-gradient(90deg, #fbbf24, #e94560)"
              bgClip="text"
              color="transparent"
              style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              {THEME_LABELS[theme] || 'レスキュー投稿一覧'}
            </Heading>
            <Text fontSize="md" color="gray.300">
              他の人の投稿に励ましを送ろう
            </Text>
          </VStack>

          <Button
            colorScheme="pink"
            borderRadius="full"
            boxShadow="0 0 16px rgba(233, 69, 96, 0.4)"
            _hover={{ transform: 'scale(1.02)' }}
            transition="all 0.2s"
            onClick={handleNewPost}
          >
            新しい投稿を作る
          </Button>

          {isLoading ? (
            <Text textAlign="center" py={8} color="gray.400">
              読み込み中...
            </Text>
          ) : posts.length === 0 ? (
            <Box
              p={8}
              bg="white"
              borderRadius="2xl"
              borderWidth="2px"
              borderColor="pink.400"
              boxShadow="0 0 20px rgba(233, 69, 96, 0.2)"
              textAlign="center"
            >
              <Text color="gray.600">まだ投稿がありません。最初の投稿をしてみませんか？</Text>
            </Box>
          ) : (
            <VStack gap={4} align="stretch">
              {posts.map((post) => (
                <Box
                  key={post.id}
                  p={5}
                  bg="white"
                  borderRadius="xl"
                  borderWidth="2px"
                  borderColor="cyan.200"
                  boxShadow="0 4px 20px rgba(0,0,0,0.15)"
                  _hover={{ borderColor: 'cyan.400', boxShadow: '0 0 16px rgba(14, 165, 233, 0.25)' }}
                  transition="all 0.2s"
                >
                  <VStack align="stretch" gap={3}>
                    <HStack justify="space-between">
                      <Badge colorScheme="cyan" borderRadius="full" px={3} py={1}>
                        {post.anonymous_id}
                      </Badge>
                      <Text fontSize="sm" color="gray.500">
                        {new Date(post.created_at).toLocaleDateString('ja-JP')}
                      </Text>
                    </HStack>
                    <Box
                      p={4}
                      bg="gray.50"
                      borderRadius="lg"
                      cursor="pointer"
                      onClick={() => router.push(`/post/${post.id}`)}
                      _hover={{ bg: 'cyan.50' }}
                      transition="background 0.2s"
                    >
                      <Text fontSize="md" color="gray.700" lineClamp={3}>
                        {post.content}
                      </Text>
                    </Box>
                    <Button
                      colorScheme="green"
                      size="sm"
                      borderRadius="full"
                      _hover={{ transform: 'scale(1.02)' }}
                      transition="all 0.2s"
                      onClick={() => handleEncourage(post.id)}
                    >
                      励ます
                    </Button>
                  </VStack>
                </Box>
              ))}
            </VStack>
          )}

          <Button
            variant="outline"
            borderColor="gray.400"
            color="gray.200"
            _hover={{ bg: 'whiteAlpha.200', borderColor: 'gray.300' }}
            borderRadius="full"
            onClick={() => router.push('/theme-select')}
          >
            テーマ選択に戻る
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}

export default function PostsPage() {
  return (
    <Suspense fallback={
      <Box minH="100vh" bg="linear-gradient(180deg, #2d1b4e 0%, #1a1a2e 50%, #16213e 100%)" backgroundAttachment="fixed" py={12} display="flex" alignItems="center" justifyContent="center">
        <Text color="gray.400">読み込み中...</Text>
      </Box>
    }>
      <PostsContent />
    </Suspense>
  );
}
