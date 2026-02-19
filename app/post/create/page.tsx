'use client';

import { Box, Container, VStack, Heading, Text, Button, useColorModeValue, Textarea, FormControl, FormLabel } from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

const THEME_LABELS: Record<string, string> = {
  'work-study': '仕事・勉強の悩み',
  'relationships': '人間関係の悩み',
  'future-anxiety': '将来への不安',
  'failure': 'ちょっとした失敗・落ち込み',
  'general': 'とにかく励ましてほしい',
};

export default function CreatePostPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const theme = searchParams?.get('theme') || '';
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const generateAnonymousId = () => {
    return `user_${Math.random().toString(36).substring(2, 9)}`;
  };

  const handleSubmit = async () => {
    if (!content.trim() || !theme) return;

    try {
      setIsSubmitting(true);
      const anonymousId = generateAnonymousId();

      const { error } = await supabase
        .from('rescue_posts')
        .insert({
          theme,
          content: content.trim(),
          anonymous_id: anonymousId,
        });

      if (error) throw error;

      router.push(`/posts?theme=${theme}`);
    } catch (error) {
      console.error('投稿エラー:', error);
      alert('投稿に失敗しました');
    } finally {
      setIsSubmitting(false);
    }
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
              新しい投稿を作る
            </Heading>
            <Badge colorScheme="blue">{THEME_LABELS[theme]}</Badge>
          </VStack>

          <Box p={8} bg={cardBg} borderRadius="lg" boxShadow="md">
            <VStack spacing={6} align="stretch">
              <FormControl>
                <FormLabel>あなたの気持ちを書いてください</FormLabel>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="今、どんな気持ちですか？どんなことで落ち込んでいますか？"
                  rows={8}
                  maxLength={500}
                />
                <Text fontSize="sm" color="gray.500" mt={2}>
                  {content.length} / 500文字
                </Text>
              </FormControl>

              <Button
                colorScheme="blue"
                size="lg"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                isDisabled={!content.trim()}
              >
                投稿する
              </Button>

              <Button variant="ghost" onClick={() => router.push(`/posts?theme=${theme}`)}>
                キャンセル
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
