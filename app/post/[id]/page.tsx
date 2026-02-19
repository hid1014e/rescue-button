'use client';

import { Box, Container, VStack, Heading, Text, Button, useColorModeValue, Badge, HStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

interface Post {
  id: string;
  theme: string;
  content: string;
  anonymous_id: string;
  created_at: string;
}

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [post, setPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('rescue_posts')
        .select('*')
        .eq('id', params.id)
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
      <Box minH="100vh" bg={bgColor} py={12}>
        <Container maxW="container.md">
          <Text textAlign="center">読み込み中...</Text>
        </Container>
      </Box>
    );
  }

  if (!post) {
    return (
      <Box minH="100vh" bg={bgColor} py={12}>
        <Container maxW="container.md">
          <Text>投稿が見つかりません</Text>
          <Button onClick={() => router.push('/theme-select')}>トップに戻る</Button>
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
              投稿詳細
            </Heading>
          </VStack>

          <Box p={8} bg={cardBg} borderRadius="lg" boxShadow="md">
            <VStack spacing={6} align="stretch">
              <HStack justify="space-between">
                <Badge colorScheme="blue">{post.anonymous_id}</Badge>
                <Text fontSize="sm" color="gray.500">
                  {new Date(post.created_at).toLocaleString('ja-JP')}
                </Text>
              </HStack>

              <Box p={4} bg="blue.50" borderRadius="md">
                <Text fontSize="lg" color="gray.700" whiteSpace="pre-wrap">
                  {post.content}
                </Text>
              </Box>

              <Button
                colorScheme="green"
                size="lg"
                onClick={handleEncourage}
              >
                この投稿に励ましを送る
              </Button>

              <Button variant="ghost" onClick={() => router.back()}>
                戻る
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
