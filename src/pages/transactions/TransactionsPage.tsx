import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import { Transaction } from "@/types/Transaction";
import { Pencil, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const setLoading = useLoadingStore((state) => state.setLoading);

  const location = useLocation();

  const page = new URLSearchParams(location.search).get("page") || "1";

  const getNextPage = () => {
    return parseInt(page) + 1;
  };

  const getPrevPage = () => {
    return parseInt(page) - 1 < 1 ? 1 : parseInt(page) - 1;
  };

  const deleteTransaction = async (id: string) => {
    setLoading(true);
    await AxiosClient()
      .delete(`/entries/${id}`)
      .catch((error) => {
        console.error(error);
      });

    await fetchTransactions();
  };

  const fetchTransactions = async () => {
    setLoading(true);
    await AxiosClient()
      .get(`/entries?page=${page}`)
      .then((response) => {
        setTransactions(response.data.data.entries);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, [setLoading]);

  return (
    <div className="py-6">
      <div className="container">
        <div className="flex justify-between items-start">
          <div className="text-3xl font-medium mb-4">Transactions</div>
          <Link to="/transactions/new">
            <Button>New</Button>
          </Link>
        </div>
        <div className="grid gap-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
                <TableHead>Created at</TableHead>
                <TableHead>Updated at</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{transaction.title}</TableCell>
                  <TableCell
                    className={`${
                      transaction.type == "INCOME"
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type.toLocaleUpperCase()}
                  </TableCell>
                  <TableCell>{transaction.categoryName}</TableCell>
                  <TableCell
                    className={`${
                      transaction.type == "INCOME"
                        ? "text-blue-600"
                        : "text-red-600"
                    }`}
                  >
                    Rs. {transaction.amount}/-
                  </TableCell>
                  <TableCell className="flex gap-4">
                    <Link to={`/transactions/${transaction._id}`}>
                      <Pencil size={15} />
                    </Link>
                    <Trash2
                      size={15}
                      className="cursor-pointer"
                      onClick={() => {
                        deleteTransaction(transaction._id);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.createdAt).toLocaleString("sv-SE")}
                  </TableCell>
                  <TableCell>
                    {new Date(transaction.updatedAt).toLocaleString("sv-SE")}
                  </TableCell>
                </TableRow>
              ))}
              {transactions.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <div className="font-medium">
                      You don't have any transactions yet. <br />
                      <Link to="/transactions/new" className="text-primary">
                        Add a transaction
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href={`/transactions?page=${getPrevPage()}`}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">{page}</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href={`/transactions?page=${getNextPage()}`} />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
