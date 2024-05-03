import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import AxiosClient from "@/lib/axios-client/axiosClient";
import useLoadingStore from "@/store/loadingStore";
import { Category } from "@/types/Category";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CategoriesPage = () => {
  const [transactionCategories, setTransactionCategories] = useState<
    Category[]
  >([]);

  const setLoading = useLoadingStore((state) => state.setLoading);

  const deleteCategory = async (id: string) => {
    setLoading(true);
    await AxiosClient()
      .delete(`/categories/${id}`)
      .catch((error) => {
        console.error(error);
      });

    await fetchCategories();
  };

  const fetchCategories = async () => {
    setLoading(true);
    await AxiosClient()
      .get("/categories")
      .then((response) => {
        setTransactionCategories(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, [setLoading]);

  return (
    <div className="py-6">
      <div className="container">
        <div className="flex justify-between items-start">
          <div className="text-3xl font-medium mb-4">Categories</div>
          <Link to={"/categories/new"}>
            <Button>New</Button>
          </Link>
        </div>
        <div className="grid">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead>Created at</TableHead>
                <TableHead>Updated at</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactionCategories.map((category, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell className="flex gap-4">
                    <Link to={`/categories/${category._id}`}>
                      <Pencil size={15} />
                    </Link>
                    <Trash2
                      size={15}
                      className="cursor-pointer"
                      onClick={() => {
                        deleteCategory(category._id);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(category.createdAt).toLocaleString("sv-SE")}
                  </TableCell>
                  <TableCell>
                    {new Date(category.updatedAt).toLocaleString("sv-SE")}
                  </TableCell>
                </TableRow>
              ))}
              {transactionCategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center pt-10">
                    You don't have any transaction categories yet. <br />
                    <Link to="/categories/new" className="text-primary">
                      Add a transaction category
                    </Link>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default CategoriesPage;
