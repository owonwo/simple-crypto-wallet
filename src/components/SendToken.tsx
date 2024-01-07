import { useWallet } from "../contexts/wallet-provider.tsx";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { z } from "zod";
import { ethers } from "ethers";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form.tsx";
import { cn } from "@/lib/utils.ts";
import { useSendTransaction } from "../hooks/use-transaction.tsx";
import { toastErrorMessage } from "../libs/errors.ts";
import { Loader2 } from "lucide-react";
import { standardAmount } from "../libs/utils.ts";
import React from "react";

const SendTokenForm = z.object({
  address: z.string().refine((val) => ethers.utils.isAddress(val), {
    message: "Invalid wallet address provided",
  }),
  amount: z
    .string({
      required_error: "Enter a valid amount",
    })
    .refine(
      (num) => {
        try {
          // input number should be greater than 1 wei
          return ethers.utils
            .parseUnits("1", "wei")
            .lte(ethers.utils.parseEther(String(num)));
        } catch (err) {
          return false;
        }
      },
      { message: "Enter a valid amount" },
    ),
});

export function SendToken() {
  const { isConnected, login } = useWallet();
  const { loading, sendTransaction, gasFee, getEstimatedGasFee } =
    useSendTransaction();

  const form = useForm({
    defaultValues: { amount: 0, address: "" },
    resolver: zodResolver(SendTokenForm),
    mode: "all",
  });

  const onSubmit = form.handleSubmit((data) => {
    sendTransaction({
      amount: String(data.amount),
      destination: data.address,
    })
      .then((receipt) => {
        form.reset();

        console.log("Transaction Receipt", receipt);
      })
      .catch(toastErrorMessage);
  });

  React.useEffect(() => {
    getEstimatedGasFee({
      amount: String(form.watch("amount")),
      destination: form.watch("address"),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.watch("amount"), form.watch("address")]);

  return (
    <div
      className={
        "items-center justify-stretch mx-auto flex flex-col -space-y-4 py-5"
      }
    >
      <div
        className={
          "border bg-[#181f2a] border-white/[0.06] shadow p-8 rounded-t-3xl"
        }
      >
        <p className={"text-sm uppercase mb-3 opacity-75 tracking-widest"}>
          Balance
        </p>
        <Balance />
      </div>

      <Form {...form}>
        <form
          onSubmit={onSubmit}
          className={
            "w-full bg-white/[0.02] filter backdrop-blur-sm border border-white/[0.2] bg-gradient-to-b to-white/[0.04] via-white/[0.02] from-gray-800 rounded-3xl shadow-2xl space-y-6 p-5"
          }
        >
          <h4 className={"text-3xl font-semibold tracking-tight"}>Send ETH</h4>

          <div className={"flex my-2 flex-col space-y-2"}>
            <FormField
              name={"address"}
              control={form.control}
              render={({ field, fieldState }) => {
                return (
                  <FormItem>
                    <Label>Receiver address</Label>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={"0x695EE2623..."}
                        className={cn("bg-transparent", {
                          "!ring-red-500": fieldState.error,
                        })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <div className={"flex my-2 flex-col space-y-2"}>
            <FormField
              name={"amount"}
              control={form.control}
              render={({ field }) => {
                return (
                  <FormItem>
                    <Label>Amount</Label>
                    <FormControl>
                      <Input
                        {...field}
                        className={"bg-transparent"}
                        placeholder="0.00000"
                        inputMode="decimal"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          {form.formState.isValid ? (
            <p className={"flex justify-between"}>
              <span className={"text-gray-300"}>Gas Fee</span>
              {loading.estimatingFee ? (
                <Loader2 className="mr-2 text-orange-300 h-4 w-4 animate-spin" />
              ) : gasFee ? (
                <span>~ {standardAmount(gasFee)} ETH</span>
              ) : null}
            </p>
          ) : null}

          {isConnected ? (
            <Button
              disabled={!form.formState.isValid}
              className={
                "font-bold w-full bg-orange-600 hover:bg-orange-500 text-white rounded-xl !py-4 h-auto"
              }
            >
              {loading.default ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              Send ETH
            </Button>
          ) : (
            <Button
              type={"button"}
              variant="secondary"
              className={
                "font-bold w-full bg-orange-500 hover:bg-orange-400 text-white rounded-xl !py-4 h-auto"
              }
              onClick={login}
            >
              LOGIN
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
}

function Balance() {
  const wallet = useWallet();
  const [integer, decimal] = standardAmount(wallet?.data?.balance).split(".");

  return (
    <h4 className={"text-5xl font-semibold font-numeric"}>
      {integer}
      <span className={"opacity-25"}>.{decimal}</span>
      <span className={"text-sm text-orange-500"}>&nbsp;&nbsp;ETH</span>
    </h4>
  );
}
