'use client';

import { Box, Container, VStack, Heading, Text, Button, useColorModeValue, Textarea, FormControl, FormLabel, Alert, AlertIcon } from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
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

export default function EncouragePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams?.get('postId') || '';
  const [post, setPost] = useState<Post | null>(null);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

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
              励ましを送る
            </Heading>
            <Text fontSize="md" color="gray.600">
              {post.anonymous_id}さんの投稿に、励ましを送りましょう
            </Text>
          </VStack>

          <Box p={8} bg={cardBg} borderRadius="lg" boxShadow="md">
            <VStack spacing={6} align="stretch">
              <Box p={4} bg="blue.50" borderRadius="md">
                <Text fontWeight="bold" mb={2}>投稿内容</Text>
                <Text color="gray.700">{post.content}</Text>
              </Box>

              <Alert status="info" borderRadius="md">
                <AlertIcon />
                <Box>
                  <Text fontWeight="bold">相手が前向きになれるような、温かい言葉を選びましょう。</Text>
                  <Text fontSize="sm" mt={1}>
                    「頑張って！」だけでなく、「〇〇なところ、素敵ですね」など、具体的な共感も良いでしょう。
                  </Text>
                </Box>
              </Alert>

              <FormControl>
                <FormLabel>励ましメッセージ</FormLabel>
                <VStack spacing={2} align="stretch" mb={4}>
                  <Text fontSize="sm" color="gray.600">テンプレートから選ぶ（クリックで入力欄に反映）:</Text>
                  <Box display="flex" flexWrap="wrap" gap={2}>
                    {ENCOURAGEMENT_TEMPLATES.map((template) => (
                      <Button
                        key={template}
                        size="sm"
                        variant="outline"
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
                <Text fontSize="sm" color="gray.500" mt={2}>
                  {message.length} / 300文字
                </Text>
              </FormControl>

              <Button
                colorScheme="green"
                size="lg"
                onClick={handleSubmit}
                isLoading={isSubmitting}
                isDisabled={!message.trim()}
              >
                応援メッセージを送る
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
