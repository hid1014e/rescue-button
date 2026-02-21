'use client';

import { Box, Container, VStack, Heading, Text, Button, Textarea, Field } from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';

const ENCOURAGEMENT_TEMPLATES = [
  '共感します！',
  'きっと大丈夫！',
  'あなたは一人じゃないよ',
  '頑張っている姿、素敵です',
  '無理しなくて大丈夫',
];

interface Post {
  id: string;
  content: string;
  anonymous_id: string;
}

function EncourageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams?.get('postId') || '';
  const [post, setPost] = useState<Post | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const bgGradient = 'linear-gradient(180deg, #2d1b4e 0%, #1a1a2e 50%, #16213e 100%)';

  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('rescue_posts')
        .select('*')
        .eq('id', postId)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('投稿取得エラー:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTemplateClick = (template: string) => {
    setMessage(template);
  };

  const handleSubmit = async () => {
    if (!message.trim() || !postId) return;

    try {
      setIsSubmitting(true);
      const { error } = await supabase
        .from('rescue_encouragements')
        .insert({
          post_id: postId,
          message: message.trim(),
          anonymous_id: `encourager_${Math.random().toString(36).substring(2, 9)}`,
        });

      if (error) throw error;

      router.push(`/complete?postId=${postId}`);
    } catch (error) {
      console.error('励まし送信エラー:', error);
      alert('励ましメッセージの送信に失敗しました');
    } finally {
      setIsSubmitting(false);
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
          <Text>投稿が見つかりません</Text>
          <Button onClick={() => router.push('/theme-select')}>トップに戻る</Button>
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
              励ましを送る
            </Heading>
            <Text fontSize="md" color="gray.300">
              {post.anonymous_id}さんの投稿に、励ましを送りましょう
            </Text>
          </VStack>

          <Box
            p={8}
            bg="white"
            borderRadius="2xl"
            borderWidth="2px"
            borderColor="green.400"
            boxShadow="0 0 24px rgba(34, 197, 94, 0.2), 0 8px 32px rgba(0,0,0,0.2)"
          >
            <VStack gap={6} align="stretch">
              <Box p={4} bg="cyan.50" borderRadius="xl" borderWidth="1px" borderColor="cyan.200">
                <Text fontWeight="bold" mb={2} color="gray.700">投稿内容</Text>
                <Text color="gray.700">{post.content}</Text>
              </Box>

              <Box p={4} bg="blue.50" borderRadius="xl" borderWidth="2px" borderColor="blue.200">
                <Text fontWeight="bold" color="blue.800">相手が前向きになれるような、温かい言葉を選びましょう。</Text>
                <Text fontSize="sm" mt={1} color="gray.700">
                  「頑張って！」だけでなく、「〇〇なところ、素敵ですね」など、具体的な共感も良いでしょう。
                </Text>
              </Box>

              <Field.Root>
                <Field.Label>励ましメッセージ</Field.Label>
                <VStack gap={2} align="stretch" mb={4}>
                  <Text fontSize="sm" color="gray.600">テンプレートから選ぶ（クリックで入力欄に反映）:</Text>
                  <Box display="flex" flexWrap="wrap" gap={2}>
                    {ENCOURAGEMENT_TEMPLATES.map((template) => (
                      <Button
                        key={template}
                        size="sm"
                        variant="outline"
                        colorScheme="cyan"
                        borderRadius="full"
                        onClick={() => handleTemplateClick(template)}
                      >
                        {template}
                      </Button>
                    ))}
                  </Box>
                </VStack>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="温かい励ましの言葉を書いてください..."
                  rows={6}
                  maxLength={300}
                />
                <Field.HelperText>
                  <Text fontSize="sm" color="gray.500" mt={2}>
                    {message.length} / 300文字
                  </Text>
                </Field.HelperText>
              </Field.Root>

              <Button
                colorScheme="green"
                size="lg"
                borderRadius="full"
                boxShadow="0 0 16px rgba(34, 197, 94, 0.4)"
                onClick={handleSubmit}
                loading={isSubmitting}
                disabled={!message.trim()}
                _hover={!message.trim() ? {} : { transform: 'scale(1.02)' }}
                transition="all 0.2s"
              >
                応援メッセージを送る
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

export default function EncouragePage() {
  return (
    <Suspense fallback={
      <Box minH="100vh" bg="linear-gradient(180deg, #2d1b4e 0%, #1a1a2e 50%, #16213e 100%)" backgroundAttachment="fixed" py={12} display="flex" alignItems="center" justifyContent="center">
        <Text color="gray.400">読み込み中...</Text>
      </Box>
    }>
      <EncourageContent />
    </Suspense>
  );
}
