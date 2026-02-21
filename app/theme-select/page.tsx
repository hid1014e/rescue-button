'use client';

import { Box, Container, VStack, Heading, Text, Button, SimpleGrid } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { getLastResponsesUrl } from '@/lib/rescue-storage';

const THEMES = [
  { id: 'work-study', label: '仕事・勉強の悩み' },
  { id: 'relationships', label: '人間関係の悩み' },
  { id: 'future-anxiety', label: '将来への不安' },
  { id: 'failure', label: 'ちょっとした失敗・落ち込み' },
  { id: 'general', label: 'とにかく励ましてほしい' },
];

export default function ThemeSelectPage() {
  const router = useRouter();
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const handleSelectTheme = (themeId: string) => {
    setSelectedTheme(themeId);
  };

  const handleRescue = () => {
    if (selectedTheme) {
      router.push(`/posts?theme=${selectedTheme}`);
    }
  };

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
              落ち込みテーマを選ぶ
            </Heading>
            <Text fontSize="md" color="gray.300">
              あなたの気持ちに近いテーマをひとつ選んでね
            </Text>
          </VStack>

          <Box
            p={8}
            bg="white"
            borderRadius="2xl"
            borderWidth="2px"
            borderColor="pink.400"
            boxShadow="0 0 24px rgba(233, 69, 96, 0.2), 0 8px 32px rgba(0,0,0,0.2)"
          >
            <VStack gap={6}>
              <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} w="full">
                {THEMES.map((theme) => (
                  <Button
                    key={theme.id}
                    variant={selectedTheme === theme.id ? 'solid' : 'outline'}
                    colorScheme={selectedTheme === theme.id ? 'pink' : 'gray'}
                    size="lg"
                    h="auto"
                    py={6}
                    borderRadius="xl"
                    borderWidth="2px"
                    _hover={{
                      transform: 'scale(1.02)',
                      boxShadow: selectedTheme === theme.id ? '0 0 16px rgba(233, 69, 96, 0.4)' : undefined,
                    }}
                    transition="all 0.2s"
                    onClick={() => handleSelectTheme(theme.id)}
                  >
                    {theme.label}
                  </Button>
                ))}
              </SimpleGrid>

              <Button
                colorScheme="pink"
                size="lg"
                w="full"
                borderRadius="full"
                boxShadow="0 0 20px rgba(233, 69, 96, 0.4)"
                disabled={!selectedTheme}
                onClick={handleRescue}
                mt={4}
                _hover={!selectedTheme ? {} : { transform: 'scale(1.02)', boxShadow: '0 0 28px rgba(233, 69, 96, 0.5)' }}
                transition="all 0.2s"
              >
                レスキューを求める
              </Button>

              <Button
                variant="outline"
                colorScheme="cyan"
                size="sm"
                w="full"
                borderRadius="full"
                onClick={handleMyResponses}
              >
                あなたの投稿への応援を確認する
              </Button>

              <Button
                variant="outline"
                size="sm"
                colorScheme="gray"
                borderRadius="full"
                onClick={() => router.push('/')}
              >
                トップに戻る
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
