import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import AxiosClient from "@/lib/axios-client/axiosClient";
import useAuthStore from "@/store/authStore";
import useLoadingStore from "@/store/loadingStore";
import { Category } from "@/types/Category";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeftCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import z from "zod";

const NewTransactionFormSchema = z.object({
  title: z.string().min(3),
  amount: z
    .string()
    .refine((value) => !isNaN(Number(value)), {
      message: "Amount must be a number",
    })
    .transform(Number)
    .refine((value) => value > 0, {
      message: "Amount must be a positive, non-zero value",
    }),
  type: z.enum(["INCOME", "EXPENSE"]),
  category: z.string(),
});

const NewTransactionPage = () => {
  const setLoading = useLoadingStore((state) => state.setLoading);
  const user = useAuthStore((state) => state.user);

  const navigate = useNavigate();
  const { toast } = useToast();

  const { id } = useParams<{ id: string }>();

  const form = useForm<z.infer<typeof NewTransactionFormSchema>>({
    resolver: zodResolver(NewTransactionFormSchema),
    defaultValues: {
      title: "",
      amount: 0,
      type: "EXPENSE",
    },
  });

  async function onSubmit(data: z.infer<typeof NewTransactionFormSchema>) {
    setLoading(true);
    try {
      let response;
      console.log(data);

      if (id) {
        response = await AxiosClient().put(`/entries/${id}`, {
          ...data,
        });
      } else {
        response = await AxiosClient().post("/entries", {
          ...data,
        });
      }
      toast({
        title: `Transaction ${id ? "Updated" : "Created"}`,
        description: `Transaction ${response.data.data.title} ${
          id ? "updated" : "created"
        } successfully`,
      });
      navigate("/transactions");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: `An error occurred while ${
          id ? "updating" : "creating"
        } the transaction`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const [transactionCategories, setTransactionCategories] = useState<
    Category[]
  >([]);

  useEffect(() => {
    const fetchTestData = async () => {
      const response = await AxiosClient().get(`/entries/${id}`);
      if (response.status === 200) {
        if (response.data.data.userId != user._id) {
          navigate(`/entries`);
        }
        form.reset(response.data.data);
      }
    };

    const fetchCategoriesData = async () => {
      setLoading(true);
      try {
        const response = await AxiosClient().get(`/categories`);
        if (response.status === 200) {
          setTransactionCategories(response.data.data);
          if (id) {
            fetchTestData();
          }
        } else {
          setLoading(false);
          navigate("/transactions");
        }
      } catch (error) {
        setLoading(false);
        navigate("/transactions");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoriesData();
  }, [id, navigate, setLoading, form, user._id]);

  return (
    <div className="grid gap-2 p-3 container">
      <Card className="p-4">
        <div>
          <div
            className="flex gap-2 items-center mb-2"
            onClick={() => {
              navigate(-1);
            }}
          >
            <ChevronLeftCircle size={20} />
            Back
          </div>
          <div className="text-3xl font-medium mb-2">
            {id ? "Update Transaction" : "New Transaction"}
          </div>
          <Form {...form}>
            <div className="grid gap-4 mt-2 mr-2">
              <div className="grid gap-4">
                <div className="col-span-3">
                  <FormItem>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <Input id="name" type="text" {...form.register("title")} />
                    <FormMessage>
                      {form.formState.errors.title?.message}
                    </FormMessage>
                  </FormItem>

                  <FormItem>
                    <FormLabel htmlFor="amount">Amount</FormLabel>
                    <Input
                      id="amount"
                      type="number"
                      {...form.register("amount")}
                    />
                    <FormMessage>
                      {form.formState.errors.amount?.message}
                    </FormMessage>
                  </FormItem>

                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="type">Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {["INCOME", "EXPENSE"].map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage>
                          {form.formState.errors.type?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel htmlFor="category">Category</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent>
                            {transactionCategories.map((category) => (
                              <SelectItem
                                key={category._id}
                                value={category._id}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage>
                          {form.formState.errors.category?.message}
                        </FormMessage>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <FormMessage>{form.formState.errors.root?.message}</FormMessage>

              <div className="flex gap-2">
                <FormItem>
                  <Button
                    className="w-40"
                    onClick={form.handleSubmit(onSubmit)}
                  >
                    {id ? "Update" : "Add"}
                  </Button>
                </FormItem>
                <FormItem>
                  <Button
                    className="w-40"
                    onClick={() => {
                      form.reset();
                    }}
                    variant={"outline"}
                  >
                    Reset
                  </Button>
                </FormItem>
              </div>
            </div>
          </Form>
        </div>
      </Card>
    </div>
  );
};

export default NewTransactionPage;
