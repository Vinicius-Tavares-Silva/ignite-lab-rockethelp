import { useState, useEffect } from 'react';
import { useRoute } from '@react-navigation/native';
import { HStack, Text, VStack, useTheme } from 'native-base';
import firestore from '@react-native-firebase/firestore';

import { Header } from '../components/Header';
import { OrderProps } from '../components/Order';
import { Loading } from '../components/Loading';

import { dateFormat } from '../utils/firestoreDateFormat';
import { OrderFireStoreDTO } from '../DTOs/OrderFireStoreDTO';
import { CircleWavyCheck, Hourglass } from 'phosphor-react-native';

type RouteParams = {
  orderId: string;
}

type OrderDetails = OrderProps & {
  description: string;
  solution: string;
  closed: string;
}

export function Details() {
  const [isLoading, setIsLoading] = useState(true);
  const [solution, setSolution] = useState('');
  const [order, setOrder] = useState<OrderDetails>({} as OrderDetails);

  const { colors } = useTheme();

  const route = useRoute();
  const { orderId } = route.params as RouteParams;

  useEffect(() => {
    firestore()
    .collection<OrderFireStoreDTO>('orders')
    .doc(orderId)
    .get()
    .then((doc) => {
      const { patrimony, description, status, created_at, closed_at, solution } = doc.data;
      const closed = closed_at ? dateFormat(closed_at) : null;

      setOrder({
        id: doc.id,
        patrimony,
        description,
        status,
        solution,
        when: dateFormat(created_at),
        closed,
      });
      setIsLoading(false);
    })
  },[])

  if(isLoading) {
    return <Loading />
  }

  return (
    <VStack flex={1} bg="gray.700">

      <Header title="solicitação" />
      <HStack bg="gray.500" justifyContent="center" p={4}>
        {
          order.status === 'closed'
            ? <CircleWavyCheck size={22} color={colors.green[300]} />
            : <Hourglass size={22} color={colors.secondary[700]} />
        }

        <Text
          fontSize="sm"
          color={order.status === 'closed' ? colors.green[300] : colors.secondary[700]}
          ml={2}
          textTransform="uppercase"
        >
          
        </Text>
      </HStack>

    </VStack>
  );
}