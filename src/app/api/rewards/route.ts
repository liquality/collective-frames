export const dynamic = "force-dynamic";
import { distributeRewards, sendRewardToTopCollective, setTopCollective, withdrawRewards } from "@/utils/collective";

export async function GET() {

//   setTopCollective Winner
  const receipt = await setTopCollective("0xCdB15E8722759b5141FB624c541CC99bD2b5D279", "0xaDD45b5744B41B923431F9aBd27D98399f5Ef980")
  console.log(receipt, ' << receipt')

//   withdraw reward from honey pot
  const receipt2 = await sendRewardToTopCollective("0xCdB15E8722759b5141FB624c541CC99bD2b5D279", "0x9e351Bf4F2F1FdCD76a4C40E32D7DB0330beE53C", "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913")
  console.log(receipt2, ' << receipt2')

  const receipt3 = await distributeRewards("0x9e351Bf4F2F1FdCD76a4C40E32D7DB0330beE53C", "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913")
  console.log(receipt3, ' << receipt3')

  const receipt4 = await withdrawRewards("0x9e351Bf4F2F1FdCD76a4C40E32D7DB0330beE53C", "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", [
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
  ])
  console.log(receipt4, ' << receipt4')

  return Response.json({message: "Rewards distributed successfully!"});
}
