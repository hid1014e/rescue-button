'use client';

import { Box, Container, VStack, Heading, Text, Button } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

import { getLastResponsesUrl } from '@/lib/rescue-storage';

export default function Home() {
  const router = useRouter();

  const handleMyResponses = () => {
    const saved = getLastResponsesUrl();
    router.push(saved || '/my-responses');
  };

  return (
    <Box
      minH="100vh"
      py={12}
      bg="linear-gradient(180deg, #2d1b4e 0%, #1a1a2e 50%, #16213e 100%)"
      backgroundAttachment="fixed"
    >
      <Container maxW="container.md">
        <VStack gap={10} align="stretch">
          <VStack gap={4} textAlign="center">
            <Heading
              as="h1"
              size="2xl"
              fontWeight="800"
              bg="linear-gradient(90deg, #fbbf24, #e94560, #0ea5e9)"
              bgClip="text"
              color="transparent"
              style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              落ち込みレスキューボタン
            </Heading>
            <Text fontSize="lg" color="gray.300">
              落ち込んだら、ここで励ましを受け取ろう。
              <br />
              匿名で、温かい応援だけ。
            </Text>
          </VStack>

          <Box
            p={10}
            className="game-card"
            borderRadius="2xl"
            borderWidth="2px"
            borderColor="pink.400"
            boxShadow="0 0 24px rgba(233, 69, 96, 0.25), 0 8px 32px rgba(0,0,0,0.3)"
            bg="white"
          >
            <VStack gap={6}>
              <Text fontSize="lg" color="gray.700" textAlign="center">
                誰かに話を聞いてほしい、励ましてほしいと感じているあなたへ。
                <br />
                匿名で投稿して、温かい励ましを受け取りましょう。
              </Text>

              <Button
                colorScheme="pink"
                size="lg"
                w="full"
                borderRadius="full"
                boxShadow="0 0 20px rgba(233, 69, 96, 0.4)"
                _hover={{ transform: 'scale(1.02)', boxShadow: '0 0 28px rgba(233, 69, 96, 0.5)' }}
                transition="all 0.2s"
                onClick={() => router.push('/theme-select')}
              >
                レスキューを求める
              </Button>

              <Button
                variant="outline"
                colorScheme="cyan"
                size="md"
                w="full"
                borderRadius="full"
                borderWidth="2px"
                _hover={{ bg: 'cyan.50' }}
                onClick={handleMyResponses}
              >
                あなたの投稿への応援を確認する
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
