'use client';

import { Box, Container, VStack, Heading, Text, Button, Textarea, Field, Badge } from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { setLastResponsesUrl } from '@/lib/rescue-storage';

const THEME_LABELS: Record<string, string> = {
  'work-study': '仕事・勉強の悩み',
  'relationships': '人間関係の悩み',
  'future-anxiety': '将来への不安',
  'failure': 'ちょっとした失敗・落ち込み',
  'general': 'とにかく励ましてほしい',
};

function CreatePostContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = searchParams?.get('theme') || '';
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const bgGradient = 'linear-gradient(180deg, #2d1b4e 0%, #1a1a2e 50%, #16213e 100%)';

  const generateAnonymousId = () => {
    return `user_${Math.random().toString(36).substring(2, 9)}`;
  };

  const generateViewToken = () => {
    return `vt_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  };

  const handleSubmit = async () => {
    if (!content.trim() || !theme) return;

    try {
      setIsSubmitting(true);
      const anonymousId = generateAnonymousId();
      const viewToken = generateViewToken();

      const { data, error } = await supabase
        .from('rescue_posts')
        .insert({
          theme,
          content: content.trim(),
          anonymous_id: anonymousId,
          view_token: viewToken,
        })
        .select('id')
        .single();

      if (error) throw error;
      if (!data?.id) throw new Error('投稿IDが取得できませんでした');

      const responsesUrl = `/post/${data.id}/responses?token=${encodeURIComponent(viewToken)}`;
      setLastResponsesUrl(responsesUrl);
      // ストレージ書き込みを確実に反映してから遷移
      await new Promise((r) => requestAnimationFrame(r));
      await new Promise((r) => setTimeout(r, 0));
      router.push(responsesUrl);
    } catch (error) {
      console.error('投稿エラー:', error);
      alert('投稿に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!theme) {
    return (
      <Box minH="100vh" bg={bgGradient} backgroundAttachment="fixed" py={12}>
        <Container maxW="container.md">
          <VStack gap={4}>
            <Text color="gray.300">テーマが選択されていません</Text>
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
              新しい投稿を作る
            </Heading>
            <Badge colorScheme="pink" borderRadius="full" px={4} py={1}>{THEME_LABELS[theme]}</Badge>
          </VStack>

          <Box
            p={8}
            bg="white"
            borderRadius="2xl"
            borderWidth="2px"
            borderColor="pink.400"
            boxShadow="0 0 24px rgba(233, 69, 96, 0.2), 0 8px 32px rgba(0,0,0,0.2)"
          >
            <VStack gap={6} align="stretch">
              <Field.Root>
                <Field.Label color="gray.800" fontWeight="600" fontSize="md">
                  あなたの気持ちを書いてください
                </Field.Label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="今、どんな気持ちですか？どんなことで落ち込んでいますか？"
                  rows={8}
                  maxLength={500}
                  color="gray.900"
                  _placeholder={{ color: 'gray.500' }}
                  borderColor="gray.300"
                  _focus={{ borderColor: 'pink.400', boxShadow: '0 0 0 1px var(--chakra-colors-pink-400)' }}
                />
                <Field.HelperText>
                  <Text fontSize="sm" color="gray.500" mt={2}>
                    {content.length} / 500文字
                  </Text>
                </Field.HelperText>
              </Field.Root>

              <Button
                colorScheme="pink"
                size="lg"
                borderRadius="full"
                boxShadow="0 0 16px rgba(233, 69, 96, 0.4)"
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={!content.trim()}
                _hover={!content.trim() ? {} : { transform: 'scale(1.02)' }}
                transition="all 0.2s"
              >
                投稿する
              </Button>

              <Button variant="ghost" colorScheme="gray" onClick={() => router.push(`/posts?theme=${theme}`)}>
                キャンセル
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}

export default function CreatePostPage() {
  return (
    <Suspense fallback={
      <Box minH="100vh" bg="linear-gradient(180deg, #2d1b4e 0%, #1a1a2e 50%, #16213e 100%)" backgroundAttachment="fixed" py={12} display="flex" alignItems="center" justifyContent="center">
        <Text color="gray.300">読み込み中...</Text>
      </Box>
    }>
      <CreatePostContent />
    </Suspense>
  );
}
