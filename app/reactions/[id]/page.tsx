'use client';

import { Box, Container, VStack, Heading, Text, Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { use, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const REACTION_LABELS: Record<string, string> = {
  a_bit_better: 'ちょっと元気出た',
  very_encouraged: 'すごく励まされた',
  still_struggling: '今はまだしんどい',
};

interface Encouragement {
  id: string;
  message: string;
  reaction: string | null;
  reacted_at: string | null;
}

export default function ReactionStatusPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [encouragement, setEncouragement] = useState<Encouragement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const bgGradient = 'linear-gradient(180deg, #2d1b4e 0%, #1a1a2e 50%, #16213e 100%)';

  useEffect(() => {
    if (id) fetchEncouragement();
  }, [id]);

  const fetchEncouragement = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('rescue_encouragements')
        .select('id, message, reaction, reacted_at')
        .eq('id', id)
        .single();

      if (error || !data) {
        setNotFound(true);
        setEncouragement(null);
        return;
      }
      setEncouragement(data as Encouragement);
    } catch (e) {
      setNotFound(true);
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

  if (notFound || !encouragement) {
    return (
      <Box minH="100vh" bg={bgGradient} backgroundAttachment="fixed" py={12}>
        <Container maxW="container.md">
          <VStack gap={4}>
            <Text color="gray.300">このページは表示できません。</Text>
            <Button colorScheme="pink" borderRadius="full" onClick={() => router.push('/theme-select')}>テーマを選ぶ</Button>
          </VStack>
        </Container>
      </Box>
    );
  }

  const reactionLabel = encouragement.reaction
    ? REACTION_LABELS[encouragement.reaction] || encouragement.reaction
    : '';

  return (
    <Box minH="100vh" bg={bgGradient} backgroundAttachment="fixed" py={12}>
      <Container maxW="container.md">
        <VStack gap={8} align="stretch">
          <VStack gap={2} textAlign="center">
            <Heading
              as="h1"
              size="xl"
              fontWeight="800"
              bg="linear-gradient(90deg, #34d399, #0ea5e9)"
              bgClip="text"
              color="transparent"
              style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              あなたが送ったメッセージ
            </Heading>
          </VStack>

          <Box
            p={8}
            bg="white"
            borderRadius="2xl"
            borderWidth="2px"
            borderColor="teal.400"
            boxShadow="0 0 24px rgba(20, 184, 166, 0.2), 0 8px 32px rgba(0,0,0,0.2)"
          >
            <VStack gap={6} align="stretch">
              {encouragement.reaction ? (
                <Box p={5} bg="green.50" borderRadius="xl" borderWidth="2px" borderColor="green.300">
                  <Text fontWeight="bold" textAlign="center" color="green.800" fontSize="lg">
                    あなたのメッセージに、投稿者から「{reactionLabel}」とリアクションが届きました。
                  </Text>
                </Box>
              ) : (
                <>
                  <Text fontSize="md" color="gray.700" textAlign="center">
                    まだリアクションはありません。
                  </Text>
                  <Text fontSize="sm" color="gray.600" textAlign="center">
                    相手が「届いた応援メッセージ」ページでワンタップすると、ここに表示されます。ブックマークしておくと便利です。
                  </Text>
                </>
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
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
