'use client';

import { Box, Container, VStack, Heading, Text, Button } from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { use, useEffect, useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { clearLastResponsesUrl, setLastResponsesUrl } from '@/lib/rescue-storage';

const THEME_LABELS: Record<string, string> = {
  'work-study': '仕事・勉強の悩み',
  'relationships': '人間関係の悩み',
  'future-anxiety': '将来への不安',
  'failure': 'ちょっとした失敗・落ち込み',
  'general': 'とにかく励ましてほしい',
};

interface Encouragement {
  id: string;
  message: string;
  anonymous_id: string;
  created_at: string;
}

interface Post {
  id: string;
  view_token: string | null;
  theme: string;
  content: string;
}

function PostResponsesContent({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') || '';
  const [post, setPost] = useState<Post | null>(null);
  const [encouragements, setEncouragements] = useState<Encouragement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingPost, setDeletingPost] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const bgGradient = 'linear-gradient(180deg, #2d1b4e 0%, #1a1a2e 50%, #16213e 100%)';

  const handleDeletePost = async () => {
    if (!confirm('この投稿を削除しますか？届いた応援メッセージもすべて削除されます。')) return;
    try {
      setDeletingPost(true);
      const { error } = await supabase.from('rescue_posts').delete().eq('id', id);
      if (error) throw error;
      clearLastResponsesUrl();
      router.push('/');
    } catch (e) {
      console.error(e);
      alert('削除に失敗しました');
    } finally {
      setDeletingPost(false);
    }
  };

  const handleDeleteEncouragement = async (encId: string) => {
    if (!confirm('この応援メッセージを削除しますか？')) return;
    try {
      setDeletingId(encId);
      const { error } = await supabase.from('rescue_encouragements').delete().eq('id', encId);
      if (error) throw error;
      setEncouragements((prev) => prev.filter((e) => e.id !== encId));
    } catch (e) {
      console.error(e);
      alert('削除に失敗しました');
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (id && token) fetchData();
  }, [id, token]);

  // このページを開いたときに「最後の届いた応援URL」として保存（同じブラウザで「あなたの投稿への応援」から開けるようにする）
  useEffect(() => {
    if (id && token) {
      const url = `/post/${id}/responses?token=${encodeURIComponent(token)}`;
      setLastResponsesUrl(url);
    }
  }, [id, token]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const { data: postData, error: postError } = await supabase
        .from('rescue_posts')
        .select('id, view_token, theme, content')
        .eq('id', id)
        .single();

      if (postError || !postData) {
        setPost(null);
        return;
      }
      if (postData.view_token !== token) {
        setPost(null);
        return;
      }
      setPost(postData as Post);
      // 表示できるURLであることを確認したうえで確実に保存
      setLastResponsesUrl(`/post/${id}/responses?token=${encodeURIComponent(token)}`);

      const { data: list, error: listError } = await supabase
        .from('rescue_encouragements')
        .select('id, message, anonymous_id, created_at')
        .eq('post_id', id)
        .order('created_at', { ascending: true });

      if (!listError) setEncouragements((list as Encouragement[]) || []);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
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
            <Text color="gray.300">このページは表示できません。URLをご確認ください。</Text>
            <Button colorScheme="pink" borderRadius="full" onClick={() => router.push('/theme-select')}>テーマを選ぶ</Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  return (
    <Box minH="100vh" bg={bgGradient} backgroundAttachment="fixed" py={12}>
      <Container maxW="container.md">
        <VStack gap={8} align="stretch">
          <VStack gap={2} textAlign="center">
            <Heading
              as="h1"
              size="xl"
              fontWeight="800"
              bg="linear-gradient(90deg, #fbbf24, #e94560)"
              bgClip="text"
              color="transparent"
              style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              届いた応援メッセージ
            </Heading>
            <Text fontSize="sm" color="gray.300">
              あなたの投稿に届いたメッセージです。
            </Text>
          </VStack>

          <Box
            p={5}
            bg="white"
            borderRadius="xl"
            borderWidth="2px"
            borderColor="pink.300"
            boxShadow="0 4px 20px rgba(0,0,0,0.08)"
          >
            <Text fontSize="sm" fontWeight="bold" color="gray.600" mb={2}>
              あなたの投稿（この悩みへの応援です）
            </Text>
            <Text fontSize="sm" color="gray.500" mb={2}>
              {THEME_LABELS[post.theme] ?? post.theme}
            </Text>
            <Text fontSize="md" color="gray.700" whiteSpace="pre-wrap">
              {post.content}
            </Text>
            <Button
              size="sm"
              variant="outline"
              colorScheme="red"
              mt={4}
              loading={deletingPost}
              onClick={handleDeletePost}
            >
              この投稿を削除する
            </Button>
          </Box>

          {encouragements.length === 0 ? (
            <Box
              p={8}
              bg="white"
              borderRadius="2xl"
              borderWidth="2px"
              borderColor="pink.400"
              boxShadow="0 0 20px rgba(233, 69, 96, 0.2)"
              textAlign="center"
            >
              <Text color="gray.600">まだ応援メッセージは届いていません。</Text>
              <Text fontSize="sm" color="gray.500" mt={2}>
                このURLをブックマークしておくと、後から届いたメッセージを確認できます。
              </Text>
            </Box>
          ) : (
            <VStack gap={4} align="stretch">
              {encouragements.map((enc) => (
                <Box
                  key={enc.id}
                  p={5}
                  bg="white"
                  borderRadius="xl"
                  borderWidth="2px"
                  borderColor="cyan.200"
                  boxShadow="0 4px 20px rgba(0,0,0,0.1)"
                  position="relative"
                >
                  <Text fontSize="md" color="gray.700" mb={3} whiteSpace="pre-wrap" pr={16}>
                    {enc.message}
                  </Text>
                  <Text fontSize="xs" color="gray.500" mb={3}>
                    {new Date(enc.created_at).toLocaleString('ja-JP')}
                  </Text>
                  <Button
                    size="xs"
                    variant="ghost"
                    colorScheme="red"
                    position="absolute"
                    top={3}
                    right={3}
                    loading={deletingId === enc.id}
                    onClick={() => handleDeleteEncouragement(enc.id)}
                  >
                    削除
                  </Button>
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
            テーマを選ぶ
          </Button>
        </VStack>
      </Container>
    </Box>
  );
}

export default function PostResponsesPage({ params }: { params: Promise<{ id: string }> }) {
  return (
    <Suspense fallback={
      <Box minH="100vh" bg="linear-gradient(180deg, #2d1b4e 0%, #1a1a2e 50%, #16213e 100%)" backgroundAttachment="fixed" py={12} display="flex" alignItems="center" justifyContent="center">
        <Text color="gray.400">読み込み中...</Text>
      </Box>
    }>
      <PostResponsesContent params={params} />
    </Suspense>
  );
}
