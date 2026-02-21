'use client';

import { Box, Container, VStack, Heading, Text, Button, Badge, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Post {
  id: string;
  theme: string;
  content: string;
  anonymous_id: string;
  created_at: string;
}

export default function PostDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const bgGradient = 'linear-gradient(180deg, #2d1b4e 0%, #1a1a2e 50%, #16213e 100%)';

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('rescue_posts')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('投稿取得エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEncourage = () => {
    router.push(`/encourage?postId=${post?.id}`);
  };

  if (isLoading) {
    return (
      <Box minH="100vh" bg={bgGradient} backgroundAttachment="fixed" py={12}>
        <Container maxW="container.md">
          <Text textAlign="center" color="gray.400">読み込み中...</Text>
        </Container>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box minH="100vh" bg={bgGradient} backgroundAttachment="fixed" py={12}>
        <Container maxW="container.md">
          <VStack gap={4}>
            <Text color="gray.300">投稿が見つかりません</Text>
            <Button colorScheme="pink" borderRadius="full" onClick={() => router.push('/theme-select')}>トップに戻る</Button>
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
              bg="linear-gradient(90deg, #0ea5e9, #e94560)"
              bgClip="text"
              color="transparent"
              style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              投稿詳細
            </Heading>
          </VStack>

          <Box
            p={8}
            bg="white"
            borderRadius="2xl"
            borderWidth="2px"
            borderColor="cyan.400"
            boxShadow="0 0 24px rgba(14, 165, 233, 0.2), 0 8px 32px rgba(0,0,0,0.2)"
          >
            <VStack gap={6} align="stretch">
              <HStack justify="space-between">
                <Badge colorScheme="cyan" borderRadius="full" px={3} py={1}>{post.anonymous_id}</Badge>
                <Text fontSize="sm" color="gray.500">
                  {new Date(post.created_at).toLocaleString('ja-JP')}
                </Text>
              </HStack>

              <Box p={4} bg="cyan.50" borderRadius="xl" borderWidth="1px" borderColor="cyan.200">
                <Text fontSize="lg" color="gray.700" whiteSpace="pre-wrap">
                  {post.content}
                </Text>
              </Box>

              <Button
                colorScheme="green"
                size="lg"
                borderRadius="full"
                boxShadow="0 0 16px rgba(34, 197, 94, 0.4)"
                _hover={{ transform: 'scale(1.02)' }}
                transition="all 0.2s"
                onClick={handleEncourage}
              >
                この投稿に励ましを送る
              </Button>

              <Button variant="ghost" colorScheme="gray" onClick={() => router.back()}>
                戻る
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
