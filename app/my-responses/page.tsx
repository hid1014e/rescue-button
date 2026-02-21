'use client';

import { Box, Container, VStack, Heading, Text, Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getLastResponsesUrl } from '@/lib/rescue-storage';

export default function MyResponsesPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const saved = getLastResponsesUrl();
    if (saved) {
      router.replace(saved);
      return;
    }
    setChecked(true);
  }, [router]);

  if (!checked) {
    return (
      <Box
        minH="100vh"
        py={12}
        bg="linear-gradient(180deg, #2d1b4e 0%, #1a1a2e 50%, #16213e 100%)"
        backgroundAttachment="fixed"
      >
        <Container maxW="container.md">
          <Text textAlign="center" color="gray.400">読み込み中...</Text>
        </Container>
      </Box>
    );
  }

  return (
    <Box
      minH="100vh"
      py={12}
      bg="linear-gradient(180deg, #2d1b4e 0%, #1a1a2e 50%, #16213e 100%)"
      backgroundAttachment="fixed"
    >
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
              あなたの投稿への応援
            </Heading>
          </VStack>

          <Box
            p={8}
            bg="white"
            borderRadius="2xl"
            borderWidth="2px"
            borderColor="pink.400"
            boxShadow="0 0 20px rgba(233, 69, 96, 0.2)"
            textAlign="center"
          >
            <Text color="gray.600" mb={4}>
              投稿はありません。
            </Text>
            <Text fontSize="sm" color="gray.500" mb={6}>
              レスキューを求めるで投稿すると、届いた応援をここで確認できます。
            </Text>
            <Button
              colorScheme="pink"
              size="lg"
              borderRadius="full"
              onClick={() => router.push('/theme-select')}
            >
              レスキューを求める
            </Button>
          </Box>

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
