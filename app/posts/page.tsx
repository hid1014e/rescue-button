'use client';

import { Box, Container, VStack, Heading, Text, Button, useColorModeValue, Card, CardBody, HStack, Badge } from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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

export default function PostsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = searchParams?.get('theme') || '';
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

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

  if (!theme) {
    return (
      <Box minH="100vh" bg={bgColor} py={12}>
        <Container maxW="container.md">
          <Text>テーマが選択されていません</Text>
          <Button onClick={() => router.push('/theme-select')}>テーマを選ぶ</Button>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor} py={12}>
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          <VStack spacing={4} textAlign="center">
            <Heading as="h1" size="xl" color="blue.600">
              {THEME_LABELS[theme] || 'レスキュー投稿一覧'}
            </Heading>
            <Text fontSize="md" color="gray.600">
              他のユーザーの投稿に励ましを送りましょう
            </Text>
          </VStack>

          <Button colorScheme="blue" onClick={handleNewPost}>
            新しい投稿を作る
          </Button>

          {isLoading ? (
            <Text textAlign="center" py={8}>読み込み中...</Text>
          ) : posts.length === 0 ? (
            <Box p={8} bg={cardBg} borderRadius="lg" textAlign="center">
              <Text color="gray.600">まだ投稿がありません。最初の投稿をしてみませんか？</Text>
            </Box>
          ) : (
            <VStack spacing={4} align="stretch">
              {posts.map((post) => (
                <Card key={post.id} bg={cardBg}>
                  <CardBody>
                    <VStack align="stretch" spacing={3}>
                      <HStack justify="space-between">
                        <Badge colorScheme="blue">{post.anonymous_id}</Badge>
                        <Text fontSize="sm" color="gray.500">
                          {new Date(post.created_at).toLocaleDateString('ja-JP')}
                        </Text>
                      </HStack>
                      <Box
                        p={3}
                        bg="gray.50"
                        borderRadius="md"
                        cursor="pointer"
                        onClick={() => router.push(`/post/${post.id}`)}
                        _hover={{ bg: 'gray.100' }}
                      >
                        <Text fontSize="md" color="gray.700" noOfLines={3}>
                          {post.content}
                        </Text>
                      </Box>
                      <Button
                        colorScheme="green"
                        size="sm"
                        onClick={() => handleEncourage(post.id)}
                      >
                        励ます
                      </Button>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          )}

          <Button variant="ghost" onClick={() => router.push('/theme-select')}>
            テーマ選択に戻る
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}
