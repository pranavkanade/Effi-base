#include<cstdlib>
#include<cstdlib>


#include<iostream>
#include<iostream>

#include<cmath>
#include<cmath>

class operations
{
	public:
		int num1,  num2;
		int add,mul;

	void addition(    );

	void  multiplication();

	int    findGreater(int num1,int  num2);
	void accept_input   ();
	void display_output(  );
};

void operations:: addition(    )
{
	add =         num1	+   num2;
}

int  operations ::  findGreater(int num1,int  num2)
{
	if(num1>num2)
		return num1;
	else
		return num2;
}

void operations :: multiplication()
{
	mul =     num1* num2;
}

void operations :: accept_input()
{
	std::cout << "Enter two numbers: ";
	std::cin >> num1 >> num2;
}

void operations :: display_output()
{
	std::cout << "Addition is: " << add;
	std::cout << "Multiplication is: " << mul;
}

/*Input: number n
Output : Even or Odd
Description : Check Whether a number is even or odd.*/
int checkeven(int n)
{
 	if(n%2==0)
 		return 1;
  return 0;
}
#include<cstdlib>

/*Input: number n
Output : Prime or not Prime
Description : Check Whether a number is prime or not.*/
void checkprime(int n)
{
	bool isPrime=false;
	for(int i = 2; i <= n / 2; i=i+1)
   {
       if(n % i == 0)
       {
           isPrime = false;
           break;
       }
   }
   if (isPrime)
       std::cout << "This is a prime number";
   else
       std::cout << "This is not a prime number";

}
#include<cstdlib>
/*INPUT : None

 Output : None
 description : Print Hello Smart India Hackathon 2017. This is a great inititive
*/
void  hiSmartIndiaHackathon(){
std::cout << "Print Hello Smart India Hackathon 2017. This is a great inititive";
}

int sum_mod_10(int m,int n)
{
	int temp = (m+n)%10;
	return temp;
}

int main()
{
	int *a=new int;
	int *b=new int;
	int *c=new int;

	int i;
	for(i=100;i>50;i++)
	{
		int a;
		std::cout<<i+1;
		std::cin>>  a  ;
	}
	for(i=5;i<10;i--)
	{
		int a;
		std::cout<<i+5;
		std::cin>>  a  ;
	}
	for(i=500;i>2000;i--)
	{
		std::cout<<1+i;
	}
	for(int i=a,int b=9;true;i=i+2)
	{
		std::cout<<i++;
	}
	label:for(;;)
	{  }

	if(i>10)
	{
	   goto label;
	}
	else{
		return i;
	}

	delete a;
	delete b;


}
