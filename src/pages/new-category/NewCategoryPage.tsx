import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Form, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import AxiosClient from "@/lib/axios-client/axiosClient";
import useAuthStore from "@/store/authStore";
import useLoadingStore from "@/store/loadingStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeftCircle } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import z from "zod";

const NewCategoryFormSchema = z.object({
  name: z.string().min(3).max(50),
});

const NewCategoryPage = () => {
  const setLoading = useLoadingStore((state) => state.setLoading);
  const user = useAuthStore((state) => state.user);

  const navigate = useNavigate();
  const { toast } = useToast();

  const { id } = useParams<{ id: string }>();

  const form = useForm<z.infer<typeof NewCategoryFormSchema>>({
    resolver: zodResolver(NewCategoryFormSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: z.infer<typeof NewCategoryFormSchema>) {
    setLoading(true);
    try {
      let response;
      if (id) {
        response = await AxiosClient().put(`/categories/${id}`, {
          ...data,
        });
      } else {
        response = await AxiosClient().post("/categories", {
          ...data,
        });
      }
      toast({
        title: "Transaction category created",
        description: `Transaction category ${response.data.data.name} created successfully`,
      });
      navigate("/categories");
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: `An error occurred while ${
          id ? "updating" : "creating"
        } the transaction category`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchTestData = async () => {
      setLoading(true);
      try {
        const response = await AxiosClient().get(`/categories/${id}`);
        if (response.status === 200) {
          if (response.data.data.userId != user._id) {
            navigate(`/categories/${id}`);
          }
          form.reset(response.data.data);
          setLoading(false);
        } else {
          setLoading(false);
          navigate("/categories");
        }
      } catch (error) {
        setLoading(false);
        navigate("/categories");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchTestData();
    }
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
            {id ? "Update Transaction Category" : "New Transaction Category"}
          </div>
          <Form {...form}>
            <div className="grid gap-4 mt-2 mr-2">
              <div className="grid grid-cols-5 gap-4">
                <div className="col-span-3">
                  <FormItem>
                    <FormLabel htmlFor="name">Name</FormLabel>
                    <Input id="name" type="text" {...form.register("name")} />
                    <FormMessage>
                      {form.formState.errors.name?.message}
                    </FormMessage>
                  </FormItem>
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

export default NewCategoryPage;
