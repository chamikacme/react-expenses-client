import AxiosClient from "@/lib/axios-client/axiosClient";
import useLoadingStore from "@/store/loadingStore";
import { Transaction } from "@/types/Transaction";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const setLoading = useLoadingStore((state) => state.setLoading);

  useEffect(() => {
    setLoading(true);
    AxiosClient()
      .get("/entries")
      .then((response) => {
        setTransactions(response.data.data.entries);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setLoading(false);
      });
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
                  <TableCell>
                    <Link to={`/transactions/${transaction._id}`}>
                      <Pencil size={15} />
                    </Link>
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
                      <Link to="/transaction/new" className="text-primary">
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
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#">1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
