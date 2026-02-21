'use client';

import { Box, Container, VStack, Heading, Text, Button } from '@chakra-ui/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function CompleteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const postId = searchParams?.get('postId') || '';
  const bgGradient = 'linear-gradient(180deg, #2d1b4e 0%, #1a1a2e 50%, #16213e 100%)';

  return (
    <Box minH="100vh" bg={bgGradient} backgroundAttachment="fixed" py={12}>
      <Container maxW="container.md">
        <VStack gap={8} align="stretch">
          <VStack gap={4} textAlign="center">
            <Heading
              as="h1"
              size="xl"
              fontWeight="800"
              bg="linear-gradient(90deg, #34d399, #fbbf24)"
              bgClip="text"
              color="transparent"
              style={{ WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              お疲れ様でした！
            </Heading>
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
              <Box p={4} bg="green.50" borderRadius="xl" borderWidth="2px" borderColor="green.200">
                <Text fontWeight="bold" color="green.800">応援メッセージ、ありがとうございます！</Text>
                <Text fontSize="sm" mt={1} color="gray.700">
                  相手に届きました。
                </Text>
              </Box>

              <Text fontSize="sm" color="gray.600" textAlign="center">
                （※相手からの返信は、このゲーム内では発生しません。）
              </Text>

              <VStack gap={4} w="full">
                <Button
                  colorScheme="pink"
                  size="lg"
                  w="full"
                  borderRadius="full"
                  boxShadow="0 0 16px rgba(233, 69, 96, 0.3)"
                  onClick={() => router.push('/theme-select')}
                >
                  テーマを選ぶ
                </Button>

                <Box p={6} bg="purple.50" borderRadius="xl" borderWidth="2px" borderColor="purple.200" w="full">
                  <VStack gap={4} align="stretch">
                    <Text fontWeight="bold" color="purple.700" textAlign="center">
                      BuddyShareで、あなたの目標達成を応援してくれるバディを探す
                    </Text>
                    <Text fontSize="sm" color="gray.700" textAlign="center">
                      誰かの応援で元気が出たように、BuddyShareでは、あなたの目標達成を応援してくれる「バディ」と繋がれます。
                      <br />
                      7日間のお試しで、あなたの可能性を広げましょう！
                    </Text>
                    <Link href={process.env.NEXT_PUBLIC_BUDDYSHARE_URL || 'https://myapp.vercel.app'} target="_blank" rel="noopener">
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

export default function CompletePage() {
  return (
    <Suspense fallback={
      <Box minH="100vh" bg="linear-gradient(180deg, #2d1b4e 0%, #1a1a2e 50%, #16213e 100%)" backgroundAttachment="fixed" py={12} display="flex" alignItems="center" justifyContent="center">
        <Text color="gray.400">読み込み中...</Text>
      </Box>
    }>
      <CompleteContent />
    </Suspense>
  );
}
