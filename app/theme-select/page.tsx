'use client';

import { Box, Container, VStack, Heading, Text, Button, useColorModeValue, SimpleGrid } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

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
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  const handleSelectTheme = (themeId: string) => {
    setSelectedTheme(themeId);
  };

  const handleRescue = () => {
    if (selectedTheme) {
      router.push(`/posts?theme=${selectedTheme}`);
    }
  };

  return (
    <Box minH="100vh" bg={bgColor} py={12}>
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          <VStack spacing={4} textAlign="center">
            <Heading as="h1" size="xl" color="blue.600">
              落ち込みテーマを選ぶ
            </Heading>
            <Text fontSize="md" color="gray.600">
              あなたの気持ちに近いテーマを選んでください
            </Text>
          </VStack>

          <Box p={8} bg={cardBg} borderRadius="lg" boxShadow="md">
            <VStack spacing={6}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} w="full">
                {THEMES.map((theme) => (
                  <Button
                    key={theme.id}
                    variant={selectedTheme === theme.id ? 'solid' : 'outline'}
                    colorScheme={selectedTheme === theme.id ? 'blue' : 'gray'}
                    size="lg"
                    h="auto"
                    py={6}
                    onClick={() => handleSelectTheme(theme.id)}
                  >
                    {theme.label}
                  </Button>
                ))}
              </SimpleGrid>

              <Button
                colorScheme="blue"
                size="lg"
                w="full"
                isDisabled={!selectedTheme}
                onClick={handleRescue}
                mt={4}
              >
                レスキューを求める
              </Button>

              <Button
                variant="ghost"
                size="sm"
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
