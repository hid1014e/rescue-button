'use client';

import { Box, Container, VStack, Heading, Text, Button, useColorModeValue, Alert, AlertIcon } from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function CompletePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams?.get('postId') || '';
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');

  return (
    <Box minH="100vh" bg={bgColor} py={12}>
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch">
          <VStack spacing={4} textAlign="center">
            <Heading as="h1" size="xl" color="green.600">
              お疲れ様でした！
            </Heading>
          </VStack>

          <Box p={8} bg={cardBg} borderRadius="lg" boxShadow="md">
            <VStack spacing={6} align="stretch">
              <Alert status="success" borderRadius="md">
                <AlertIcon />
                <Box>
                  <Text fontWeight="bold">応援メッセージ、ありがとうございます！</Text>
                  <Text fontSize="sm" mt={1}>
                    相手に届きました。
                  </Text>
                </Box>
              </Alert>

              <Text fontSize="sm" color="gray.600" textAlign="center">
                （※相手からの返信は、このゲーム内では発生しません。）
              </Text>

              <Text fontSize="md" color="gray.700" textAlign="center" py={4}>
                今日のセッションのまとめ: 誰かに励ましを送りました
              </Text>

              <VStack spacing={4} w="full">
                <Button
                  colorScheme="blue"
                  size="lg"
                  w="full"
                  onClick={() => router.push('/theme-select')}
                >
                  他のレスキュー投稿を見る
                </Button>

                <Box p={6} bg="purple.50" borderRadius="md" w="full">
                  <VStack spacing={4} align="stretch">
                    <Text fontWeight="bold" color="purple.700" textAlign="center">
                      BuddyShareで、あなたの目標達成を応援してくれるバディを探す
                    </Text>
                    <Text fontSize="sm" color="gray.700" textAlign="center">
                      誰かの応援で元気が出たように、BuddyShareでは、あなたの目標達成を応援してくれる「バディ」と繋がれます。
                      <br />
                      7日間のお試しで、あなたの可能性を広げましょう！
                    </Text>
                    <Link href="https://myapp.vercel.app" target="_blank" rel="noopener">
                      <Button colorScheme="purple" size="lg" w="full">
                        BuddyShareの7日間お試しへ
                      </Button>
                    </Link>
                  </VStack>
                </Box>
              </VStack>
            </VStack>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
}
