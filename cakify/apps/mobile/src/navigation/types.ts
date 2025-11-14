export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Main: undefined;
  BakerDetails: { bakerId: string };
  Checkout: { bakerId: string; cakeId: string };
  OrderTracking: { orderId: string };
};

export type TabParamList = {
  Discover: undefined;
  Orders: undefined;
  Profile: undefined;
};
