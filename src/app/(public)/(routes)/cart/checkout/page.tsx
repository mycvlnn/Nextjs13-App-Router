import { CheckoutClient } from "./client";

interface CheckoutPageProps {
}

const CheckoutPage: React.FC<CheckoutPageProps> = async ({ }) => {
    return (
      <div className="container">    
        <div className="py-10">
        <CheckoutClient/>
        </div>
      </div>
  )
}

export default CheckoutPage;