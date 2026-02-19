'use client';

import { Box, Container, VStack, Heading, Text, Button, useColorModeValue } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box minH="100vh" bg={bgColor} py={12}>
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          <VStack spacing={4} textAlign="center">
            <Heading as="h1" size="2xl" color="blue.600">
              落ち込みレスキューボタン
            </Heading>
            <Text fontSize="lg" color="gray.600">
              落ち込んだら、ここで励ましを受け取ろう。
              <br />
              匿名で匿名な応援。
            </Text>
          </VStack>

          <Box p={8} bg={cardBg} borderRadius="lg" boxShadow="md">
            <VStack spacing={6}>
              <Text fontSize="md" color="gray.700">
                誰かに話を聞いてほしい、励ましてほしいと感じているあなたへ。
                <br />
                匿名で投稿し、温かい励ましを受け取りましょう。
              </Text>

              <VStack spacing={4} w="full">
                <Button
                  colorScheme="blue"
                  size="lg"
                  w="full"
                  onClick={() => router.push('/theme-select')}
                >
                  レスキューを求める
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  w="full"
                  onClick={() => router.push('/theme-select')}
                >
                  落ち込みテーマを選ぶ
                </Button>
              </VStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
