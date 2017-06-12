#include<iostream>
#include<stdio.h>
#include<stdlib.h>
using namespace std;

typedef enum{
	case1,case2,case3,case4
}Choice;

class AcceptNumbers{	
	int result;

	public:
		int add(int num1,int num2){
			result=num1+num2;
			return result;
		}

		int add(float num1,float num2){
			result=num1+num2;
			return result;
		}

		int subtract(int num1,int num2){
			result=num1-num2;
			return result;
		}

		int multiply(int num1,int num2){
			result=num1*num2;
			return result;
		}

		float divide(int num1,int num2){
			result=num1/num2;
			return result;
		}

		void waste_of_space(int a, int b, int c){
			int h = a+b;
			return h;
		}

		char waste_of_time(const char c){
		  (c >= 'A')&&(c <= 'M') ? (c+'N'-'A') : 
		((c >= 'N')&&(c <= 'Z') ? (c-('N'-'A')) : 
		((c >='a')&&(c <= 'm') ? (c+'n'-'a') :
		((c >= 'n')&&(c <= 'z') ? (c-('n'-'a')) : c )));
		}

		int compare_float(float a, float b){
			bool f;
			f = (a==b?1:0);
		}

};

class DividedByZeroError:public AcceptNumbers{

	public:
		void display(){
			cout<<"\nEnter any two Integer Numbers....";
		}
};

int main(){

	DividedByZeroError dz;
	int num1,num2,op;
	char choice;
	int arr[0];
	dz.display();
	cin>>num1;
	cin>>num2;
	const int NUM_OF_NUMS = 5;
        float num[NUM_OF_NUMS];
 
	if(num1=num2)
		cout<<"Num1 = Num2";
	int *myPtr = new double;

	int home=10;
	int *addr =  new int;

	addr = &home;

	int *ptr ;


	int *data = new int;
	  *data = 15;

	float c = 0.1, d = 3.4;
	int h = dz.add(a,b);

	  for (int j=0; j<NUM_OF_NUMS; j++)
	  {
	    sum += num[j];
	    cout << "your sum is "<< sum << endl;
	  }
 

	do{
		cout<<"\n1.Addition";
		cout<<"\n2.Subtraction";
		cout<<"\n3.Multiplication";
		cout<<"\n4.Division";

		Choice ch = case2;		
	
		switch(ch){
			case case1:
				cout<<"\nAddition is: "<<dz.add(num1,num2);
				break;
			case case2:
				cout<<"\nSubtraction is: "<<dz.subtract(num1,num2);
				break;
			case case3:
				cout<<"\nMultiplication is: "<<dz.multiply(num1,num2);
				break;
			case case4:
				cout<<"\nDivision is: "<<dz.divide(num1,num2);
				break;
			default:
				exit(0);
	}
		cout<<"\n\nDo u want to Continue: [y/n]";
		cin>>choice;

	}while(choice=='Y' or choice=='y');


	return 0;
	cout<<"Hello World";
	int z = 10,v;
	int a = z+v;
}
