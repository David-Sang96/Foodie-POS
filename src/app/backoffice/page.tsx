import { getServerSession } from "next-auth";

const Orders = async () => {
  const session = await getServerSession();

  return <h2>Orders: {session?.user?.email}</h2>;
};

export default Orders;
